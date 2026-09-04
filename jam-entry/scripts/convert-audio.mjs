// Converts the supplied SFX masters in audio-source/ to their shipped MP3s
// in public/audio/. Mirrors resize-art.mjs: a re-runnable script, table as
// data. Masters stay out of git (audio-source/ is gitignored) — see the
// root .gitignore note on Ramu - The Chef/Audio/ for the licence history.
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC_DIR = path.join(ROOT, 'audio-source');
const OUT_DIR = path.join(ROOT, 'public/audio');

/** shipped id -> master filename in audio-source/. */
const MASTERS = {
    ah: 'Ah.wav',
    'level-up': 'Level Up.WAV',
    'level-complete': 'Level Complete.WAV',
};

const PEAK_TARGET_DB = -3;
const SILENCE_THRESHOLD_DB = -50;
const SILENCE_MIN_DURATION_S = 0.05; // ignore blips shorter than this
const MAX_HEAD_TRIM_S = 0.5;
const PER_FILE_BUDGET_BYTES = 30 * 1024;
const TOTAL_BUDGET_BYTES = 90 * 1024;
const PRIMARY_BITRATE_KBPS = 64;
const FALLBACK_BITRATE_KBPS = 56;

function runFfmpeg(args) {
    const res = spawnSync(ffmpegPath, args, { encoding: 'utf8' });
    if (res.error) throw res.error;
    return res.stderr || '';
}

/** Single pass: reads Duration, silence_start/end pairs, and max_volume. */
function analyze(srcPath) {
    const stderr = runFfmpeg([
        '-i', srcPath,
        '-af', `silencedetect=noise=${SILENCE_THRESHOLD_DB}dB:duration=${SILENCE_MIN_DURATION_S},volumedetect`,
        '-f', 'null', '-',
    ]);

    const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (!durMatch) throw new Error(`Could not read duration from ffmpeg output for ${srcPath}`);
    const durationS = Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3]);

    const starts = [...stderr.matchAll(/silence_start:\s*(-?[\d.]+)/g)].map((m) => Number(m[1]));
    const ends = [...stderr.matchAll(/silence_end:\s*([\d.]+)/g)].map((m) => Number(m[1]));

    let headTrim = 0;
    if (starts.length > 0 && starts[0] <= 0.02 && ends.length > 0) {
        headTrim = ends[0];
    }

    let tailTrim = 0;
    if (starts.length > ends.length) {
        // Trailing silence ran to EOF with no matching silence_end.
        const lastStart = starts[starts.length - 1];
        tailTrim = Math.max(0, durationS - lastStart);
    } else if (ends.length > 0 && durationS - ends[ends.length - 1] < 0.02 && starts.length > 0) {
        const lastStart = starts[starts.length - 1];
        tailTrim = Math.max(0, durationS - lastStart);
    }

    const volMatch = stderr.match(/max_volume:\s*(-?[\d.]+)\s*dB/);
    if (!volMatch) throw new Error(`Could not read max_volume from ffmpeg output for ${srcPath}`);
    const maxVolumeDb = Number(volMatch[1]);

    return { durationS, headTrim, tailTrim, maxVolumeDb };
}

function encode(srcPath, outPath, { durationS, headTrim, tailTrim, gainDb, bitrateKbps }) {
    const filters = [];
    if (headTrim > 0 || tailTrim > 0) {
        const end = Math.max(headTrim, durationS - tailTrim);
        filters.push(`atrim=start=${headTrim.toFixed(3)}:end=${end.toFixed(3)}`);
        filters.push('asetpts=PTS-STARTPTS');
    }
    filters.push(`volume=${gainDb.toFixed(2)}dB`);
    filters.push('aformat=channel_layouts=mono');
    filters.push('aresample=44100');

    runFfmpeg([
        '-y',
        '-i', srcPath,
        '-af', filters.join(','),
        '-ac', '1',
        '-ar', '44100',
        '-c:a', 'libmp3lame',
        '-b:a', `${bitrateKbps}k`,
        outPath,
    ]);
}

/** Probes the encoded output for the verification table. */
function probe(outPath) {
    const stderr = runFfmpeg(['-i', outPath, '-f', 'null', '-']);
    const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    const streamMatch = stderr.match(/Audio:\s*(\w+).*?(\d+)\s*Hz,\s*(\w+).*?(\d+)\s*kb\/s/);
    return {
        durationS: durMatch ? Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3]) : null,
        codec: streamMatch ? streamMatch[1] : null,
        hz: streamMatch ? Number(streamMatch[2]) : null,
        channels: streamMatch ? streamMatch[3] : null,
        kbps: streamMatch ? Number(streamMatch[4]) : null,
    };
}

async function main() {
    if (!existsSync(SRC_DIR)) {
        throw new Error(`audio-source/ not found at ${SRC_DIR} — nothing to convert.`);
    }
    await mkdir(OUT_DIR, { recursive: true });

    const files = await readdir(SRC_DIR);
    const missing = Object.entries(MASTERS).filter(([, fname]) => !files.includes(fname));
    if (missing.length > 0) {
        throw new Error(`Missing masters in audio-source/: ${missing.map(([, f]) => f).join(', ')}`);
    }

    let totalBytes = 0;
    const report = [];

    for (const [id, fname] of Object.entries(MASTERS)) {
        const srcPath = path.join(SRC_DIR, fname);
        const outPath = path.join(OUT_DIR, `${id}.mp3`);

        const { durationS, headTrim, tailTrim, maxVolumeDb } = analyze(srcPath);

        if (headTrim > MAX_HEAD_TRIM_S) {
            throw new Error(
                `${fname}: detected head silence of ${headTrim.toFixed(3)}s exceeds the ${MAX_HEAD_TRIM_S}s cap — ` +
                `this looks like a soft attack, not silence. Aborting rather than eating it.`
            );
        }

        const gainDb = PEAK_TARGET_DB - maxVolumeDb;

        let bitrateKbps = PRIMARY_BITRATE_KBPS;
        encode(srcPath, outPath, { durationS, headTrim, tailTrim, gainDb, bitrateKbps });
        let sizeBytes = (await stat(outPath)).size;

        let droppedToFallback = false;
        if (sizeBytes > PER_FILE_BUDGET_BYTES) {
            bitrateKbps = FALLBACK_BITRATE_KBPS;
            encode(srcPath, outPath, { durationS, headTrim, tailTrim, gainDb, bitrateKbps });
            sizeBytes = (await stat(outPath)).size;
            droppedToFallback = true;
        }

        const outInfo = probe(outPath);
        totalBytes += sizeBytes;

        report.push({
            id,
            fname,
            srcDurationS: durationS,
            headTrim,
            tailTrim,
            maxVolumeDb,
            gainDb,
            bitrateKbps,
            droppedToFallback,
            sizeBytes,
            outInfo,
        });

        console.log(
            `${id}.mp3 <- ${fname}: ` +
            `src ${durationS.toFixed(3)}s, trimmed head ${headTrim.toFixed(3)}s / tail ${tailTrim.toFixed(3)}s, ` +
            `peak ${maxVolumeDb.toFixed(2)}dB -> gain ${gainDb.toFixed(2)}dB, ` +
            `${bitrateKbps}kbps${droppedToFallback ? ' (dropped from 64kbps, over budget)' : ''}, ` +
            `${sizeBytes}B, out: ${outInfo.durationS?.toFixed(3)}s / ${outInfo.hz}Hz / ${outInfo.channels} / ${outInfo.kbps}kb/s`
        );
    }

    console.log(`Total: ${totalBytes}B across ${report.length} files (budget ${TOTAL_BUDGET_BYTES}B).`);
    if (totalBytes > TOTAL_BUDGET_BYTES) {
        throw new Error(`Total output ${totalBytes}B exceeds the ${TOTAL_BUDGET_BYTES}B budget.`);
    }

    console.log(`Done. ${report.length} clips written to public/audio/.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

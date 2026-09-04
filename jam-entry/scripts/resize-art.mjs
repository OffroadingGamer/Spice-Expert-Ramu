// Downscales the generated art masters in art-source/ to their shipped
// sizes in public/images/. Ship sizes are 2x the on-screen draw size from
// CONFIG.sizes (src/game/config.ts) / Specs.md §5a — see that table before
// changing any entry here.
import { readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC_DIR = path.join(ROOT, 'art-source');
const OUT_DIR = path.join(ROOT, 'public/images');

/** alias -> shipped pixel size (square). Source: Phase 1.5 handover table. */
const SHIP_SIZE = {
    'tower-fox': 256,
    'tower-owl': 256,
    'tower-bear': 256,
    'tower-squirrel': 256,
    pad: 256,
    'pad-gold': 256,
    burrow: 256,
    'enemy-beetle': 192,
    'enemy-wasp': 192,
    'enemy-hornet': 192,
    'enemy-snail': 192,
    'enemy-stag': 256,
    'proj-fox': 64,
    'proj-owl': 64,
    'proj-bear': 64,
};

async function main() {
    if (!existsSync(SRC_DIR)) {
        throw new Error(`art-source/ not found at ${SRC_DIR} — nothing to resize.`);
    }
    await mkdir(OUT_DIR, { recursive: true });

    const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith('.png'));
    const missing = Object.keys(SHIP_SIZE).filter(
        (alias) => !files.includes(`${alias}.png`),
    );
    if (missing.length > 0) {
        throw new Error(`Missing masters in art-source/: ${missing.join(', ')}`);
    }

    for (const alias of Object.keys(SHIP_SIZE)) {
        const size = SHIP_SIZE[alias];
        const src = path.join(SRC_DIR, `${alias}.png`);
        const out = path.join(OUT_DIR, `${alias}.png`);

        await sharp(src)
            .resize(size, size, { kernel: sharp.kernel.lanczos3, fit: 'fill' })
            .png({ compressionLevel: 9 })
            .toFile(out);

        console.log(`${alias}.png -> ${size}x${size}`);
    }

    console.log(`Done. ${Object.keys(SHIP_SIZE).length} assets written to public/images/.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

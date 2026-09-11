/**
 * Tower icons for the React UI (upgrades menu). The tower art is Pixi
 * textures (procedural, or real art via the manifest — same art() resolver
 * either way), so to show it in DOM we render each texture once with a
 * tiny throwaway renderer and extract a PNG data URL. Generated
 * fire-and-forget at boot (main.tsx step 8) into store.towerIcons.
 */
import { autoDetectRenderer, type Renderer } from 'pixi.js';
import { TOWERS } from './data/towers.ts';
import { bakeTowerIcon, freeTexture, makeTowerLevelSizes, makeTowerLevelTextures } from './textures.ts';

/**
 * Render every tower's LEVEL 1 texture (the build card shows the base
 * station, before any upgrade) to a data URL. Never throws; may be empty.
 *
 * Playtest round, task 2: baked at the SAME per-family fit (+25% bonus)
 * towerScene.ts's board sprites use, via makeTowerLevelSizes — extracting
 * the raw texture alone (the old behaviour) ignored that scale entirely,
 * since BuildSheet.tsx's <img> is object-contain into a fixed 48px box: a
 * raw extract's on-screen size there depends only on the source PNG's own
 * aspect ratio, never on any factor computed in JS. Baking into a canvas
 * sized by that factor is what lets the icon grow when the board's does.
 */
export async function generateTowerIcons(): Promise<Record<string, string>> {
    try {
        const renderer = (await autoDetectRenderer({
            width: 16,
            height: 16,
            backgroundAlpha: 0,
        })) as Renderer;
        const icons: Record<string, string> = {};
        for (const t of TOWERS) {
            const texes = makeTowerLevelTextures(renderer, t.id);
            const sizes = makeTowerLevelSizes(texes);
            const icon = bakeTowerIcon(renderer, texes[0], sizes[0].w, sizes[0].h);
            icons[t.id] = await renderer.extract.base64(icon);
            freeTexture(icon);
            for (const tex of texes) freeTexture(tex); // frees procedural placeholders; manifest art survives
        }
        renderer.destroy();
        return icons;
    } catch {
        return {}; // no WebGL: the UI simply shows names without icons
    }
}

/**
 * Tower icons for the React UI (upgrades menu). The tower art is Pixi
 * textures (procedural, or real art via the manifest — same art() resolver
 * either way), so to show it in DOM we render each texture once with a
 * tiny throwaway renderer and extract a PNG data URL. Generated
 * fire-and-forget at boot (main.tsx step 8) into store.towerIcons.
 */
import { autoDetectRenderer, type Renderer } from 'pixi.js';
import { TOWERS } from './data/towers.ts';
import { freeTexture, makeTowerLevelTextures } from './textures.ts';

/** Render every tower's LEVEL 1 texture (the build card shows the base
 *  station, before any upgrade) to a data URL. Never throws; may be empty. */
export async function generateTowerIcons(): Promise<Record<string, string>> {
    try {
        const renderer = (await autoDetectRenderer({
            width: 16,
            height: 16,
            backgroundAlpha: 0,
        })) as Renderer;
        const icons: Record<string, string> = {};
        for (const t of TOWERS) {
            const [level1] = makeTowerLevelTextures(renderer, t.id);
            icons[t.id] = await renderer.extract.base64(level1);
            freeTexture(level1); // frees procedural placeholders; manifest art survives
        }
        renderer.destroy();
        return icons;
    } catch {
        return {}; // no WebGL: the UI simply shows names without icons
    }
}

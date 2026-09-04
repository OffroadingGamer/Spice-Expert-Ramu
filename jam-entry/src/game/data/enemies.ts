/**
 * The dishes. Each one is a ticket on the rail: `hp` is how much cooking
 * it still needs, `speed` is how fast it crawls toward the pass, `bounty` is
 * the cash it pays when SERVED, and `livesCost` is the walkouts it costs if
 * it reaches the pass unfinished.
 *
 * NOTE: the `id` strings are wired into textures, the scene, and audio.
 * Rename the `name` freely; changing an `id` is a multi-file operation. Consumed by the pure engine; `npm run balance` sees every edit.
 */
export interface EnemyDef {
    id: string;
    name: string;
    hp: number;
    /** Walk speed along the path, design units/second. */
    speed: number;
    /** Coins awarded on a kill. */
    bounty: number;
    /** Lives lost if it reaches the end. */
    livesCost: number;
}

export const ENEMIES: EnemyDef[] = [
    { id: 'beetle', name: 'Dal Tadka', hp: 46, speed: 90, bounty: 5, livesCost: 1 },
    { id: 'wasp', name: 'Masala Chai', hp: 34, speed: 150, bounty: 5, livesCost: 1 },
    { id: 'snail', name: 'Biryani', hp: 175, speed: 55, bounty: 10, livesCost: 1 },
    { id: 'hornet', name: 'Masala Dosa', hp: 90, speed: 160, bounty: 8, livesCost: 1 },
    { id: 'stag', name: 'Full Thali', hp: 700, speed: 50, bounty: 30, livesCost: 3 },
];

export function enemyDef(id: string): EnemyDef {
    const def = ENEMIES.find((e) => e.id === id);
    if (!def) throw new Error(`unknown dish: ${id}`);
    return def;
}

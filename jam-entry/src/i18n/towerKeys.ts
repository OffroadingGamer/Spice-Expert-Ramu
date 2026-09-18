/**
 * Round 13 Part 2 (docs/i18n/strings.md's own R13 constraints): data/towers.ts
 * is SEALED (jam-entry hotfix boundary — never edited), so its own `name` /
 * `metaUnique.name` / `metaUnique.desc` fields stay English forever. This is
 * the one lookup from a sealed tower id to its display key — shared by
 * StationRail.tsx (rail card, sell confirm) and MetaUpgrades.tsx (signature
 * track row) so both read the same mapping instead of two copies drifting
 * apart.
 */
export function stationNameKey(towerId: string): string {
    return `station.${towerId}`;
}

export function stationUniqueNameKey(towerId: string): string {
    return `station.${towerId}.unique`;
}

export function stationUniqueDescKey(towerId: string): string {
    return `station.${towerId}.unique.desc`;
}

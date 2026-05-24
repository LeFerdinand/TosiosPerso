// Construction d'une carte TMX simplifiée à partir d'une grille de "brushes".
// On réutilise le tileset dungeon.png déjà packagé avec le jeu.

export type BrushId = 'floor' | 'wall' | 'spawn' | 'rock' | 'empty';

export interface BrushDef {
    id: BrushId;
    label: string;
    color: string; // couleur affichée dans la palette/éditeur
    ground: number;
    walls: number;
    decor: number;
    spawners: number;
    collisions: number;
}

// Identifiants de tuiles absolues (firstgid=1)
// - 27 : tuile de sol classique
// - 51 : tuile de mur (mur du haut, plein)
// - 69 : décor (rocher)
// - 100 : marqueur de collision pleine (tileset id 99, type 'full')
// - 101 : marqueur de collision basse (tileset id 100, type 'half')
// - 102 : marqueur de spawner
export const BRUSHES: Record<BrushId, BrushDef> = {
    floor: {
        id: 'floor',
        label: 'Sol',
        color: '#5b3a3a',
        ground: 27,
        walls: 0,
        decor: 0,
        spawners: 0,
        collisions: 0,
    },
    wall: {
        id: 'wall',
        label: 'Mur',
        color: '#2a1a55',
        ground: 27,
        walls: 51,
        decor: 0,
        spawners: 0,
        collisions: 100,
    },
    spawn: {
        id: 'spawn',
        label: 'Spawn',
        color: '#3a7d44',
        ground: 27,
        walls: 0,
        decor: 0,
        spawners: 102,
        collisions: 0,
    },
    rock: {
        id: 'rock',
        label: 'Rocher',
        color: '#7a4a2a',
        ground: 27,
        walls: 0,
        decor: 69,
        spawners: 0,
        collisions: 101,
    },
    empty: {
        id: 'empty',
        label: 'Vide',
        color: '#0a051a',
        ground: 0,
        walls: 0,
        decor: 0,
        spawners: 0,
        collisions: 0,
    },
};

export const BRUSH_ORDER: BrushId[] = ['floor', 'wall', 'spawn', 'rock', 'empty'];

// Tileset utilisé par toutes les cartes (recopié à l'identique des cartes built-in)
function dungeonTileset() {
    const animatedGroups = [0, 4, 8, 12, 16];
    const tiles: any[] = animatedGroups.map((startId) => ({
        id: startId,
        animation: [0, 1, 2, 3].map((i) => ({ duration: 200, tileid: startId + i })),
    }));
    tiles.push({ id: 99, type: 'full' });
    tiles.push({ id: 100, type: 'half' });

    return {
        columns: 11,
        firstgid: 1,
        image: 'dungeon.png',
        imageheight: 176,
        imagewidth: 176,
        margin: 0,
        name: 'dungeon',
        spacing: 0,
        tilecount: 121,
        tileheight: 16,
        tiles,
        tilewidth: 16,
    };
}

function emptyLayer(name: string, width: number, height: number) {
    return {
        id: 0,
        name,
        type: 'tilelayer',
        x: 0,
        y: 0,
        width,
        height,
        opacity: 1,
        visible: true,
        data: new Array(width * height).fill(0),
    };
}

export interface MapBuildResult {
    width: number;
    height: number;
    tilewidth: number;
    tileheight: number;
    infinite: boolean;
    tilesets: any[];
    layers: any[];
}

// Construit un TMX JSON à partir d'une grille de brushes (linéaire, longueur = w*h)
export function buildMap(width: number, height: number, grid: BrushId[]): MapBuildResult {
    if (grid.length !== width * height) {
        throw new Error(`grid size ${grid.length} != expected ${width * height}`);
    }

    const ground = emptyLayer('ground', width, height);
    const walls = emptyLayer('walls', width, height);
    const decor = emptyLayer('decor', width, height);
    const spawners = emptyLayer('spawners', width, height);
    const collisions = emptyLayer('collisions', width, height);

    for (let i = 0; i < grid.length; i++) {
        const brush = BRUSHES[grid[i]];
        ground.data[i] = brush.ground;
        walls.data[i] = brush.walls;
        decor.data[i] = brush.decor;
        spawners.data[i] = brush.spawners;
        collisions.data[i] = brush.collisions;
    }

    return {
        width,
        height,
        tilewidth: 16,
        tileheight: 16,
        infinite: false,
        tilesets: [dungeonTileset()],
        layers: [ground, walls, decor, spawners, collisions],
    };
}

export const SIZES = {
    small: { width: 16, height: 16, label: 'Petite (16×16)' },
    large: { width: 32, height: 48, label: 'Grande (32×48)' },
};

export type SizeKey = keyof typeof SIZES;

export function countSpawners(grid: BrushId[]): number {
    return grid.filter((b) => b === 'spawn').length;
}

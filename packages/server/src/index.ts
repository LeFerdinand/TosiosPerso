import { monitor, MonitorOptions } from '@colyseus/monitor';
import { Constants } from '@tosios/common';
import { Server } from 'colyseus';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import * as fs from 'fs';
import { createServer } from 'http';
import { join } from 'path';
import { GameRoom } from './rooms/GameRoom';

const PORT = Number(process.env.PORT || Constants.WS_PORT);
const PUBLIC_DIR = join(__dirname, '../../client/public');
const MAPS_DIR = join(__dirname, '../data/maps');

// Préfixe pour servir le jeu sous un sous-chemin (ex: "/tosios"). Sans valeur
// le jeu est servi à la racine "/". On normalise pour ne pas garder de slash
// final, et on accepte aussi bien "/tosios" que "tosios".
const RAW_BASE_PATH = process.env.BASE_PATH || '';
const BASE_PATH = RAW_BASE_PATH
    ? (RAW_BASE_PATH.startsWith('/') ? RAW_BASE_PATH : `/${RAW_BASE_PATH}`).replace(/\/+$/, '')
    : '';

// Dossier des cartes custom
if (!fs.existsSync(MAPS_DIR)) {
    fs.mkdirSync(MAPS_DIR, { recursive: true });
}

const app = express();

// Si BASE_PATH est défini et que la requête arrive AVEC ce préfixe (c'est-à-dire
// qu'aucun reverse-proxy n'a déjà strippé le préfixe), on le retire pour que les
// routes Express / Colyseus matchent comme à la racine. En prod derrière Nginx
// avec proxy_pass "http://host/", ce middleware sera no-op (le préfixe a déjà
// disparu à l'arrivée). En local sans Nginx, il fait le travail à la place.
if (BASE_PATH) {
    app.use((req, _res, next) => {
        if (req.url === BASE_PATH) {
            req.url = '/';
        } else if (req.url.startsWith(`${BASE_PATH}/`)) {
            req.url = req.url.slice(BASE_PATH.length);
        }
        next();
    });
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(compression());

// Game server
const server = new Server({
    server: createServer(app),
    express: app,
});

// Game Rooms
server.define(Constants.ROOM_NAME, GameRoom);

// === API cartes custom ===
const MAP_ID_RE = /^[a-z0-9-]{3,64}$/;

app.get('/api/maps', (_req, res) => {
    try {
        const files = fs.readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'));
        const maps = files.map((f) => {
            const id = f.replace(/\.json$/, '');
            const raw = JSON.parse(fs.readFileSync(join(MAPS_DIR, f), 'utf-8'));
            return {
                id,
                name: raw.__meta?.name || id,
                width: raw.width,
                height: raw.height,
                createdAt: raw.__meta?.createdAt || null,
            };
        });
        res.json(maps);
    } catch (err) {
        res.status(500).json({ error: 'failed_to_list', message: String(err) });
    }
});

app.get('/api/maps/:id', (req, res) => {
    const id = req.params.id;
    if (!MAP_ID_RE.test(id)) {
        return res.status(400).json({ error: 'invalid_id' });
    }
    const filePath = join(MAPS_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'not_found' });
    }
    res.sendFile(filePath);
});

app.delete('/api/maps/:id', (req, res) => {
    const id = req.params.id;
    if (!MAP_ID_RE.test(id)) {
        return res.status(400).json({ error: 'invalid_id' });
    }
    const filePath = join(MAPS_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'not_found' });
    }
    try {
        fs.unlinkSync(filePath);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'failed_to_delete', message: String(err) });
    }
});

app.post('/api/maps', (req, res) => {
    const { name, data } = req.body || {};
    if (typeof name !== 'string' || name.trim().length < 1 || name.length > 60) {
        return res.status(400).json({ error: 'invalid_name' });
    }
    if (!data || typeof data !== 'object' || !Array.isArray(data.layers) || !Array.isArray(data.tilesets)) {
        return res.status(400).json({ error: 'invalid_data' });
    }
    if (typeof data.width !== 'number' || typeof data.height !== 'number') {
        return res.status(400).json({ error: 'invalid_dimensions' });
    }

    const slug = name
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32) || 'map';
    const suffix = Math.random().toString(16).slice(2, 8);
    const id = `${slug}-${suffix}`;

    const payload = {
        ...data,
        __meta: { name: name.trim(), createdAt: new Date().toISOString() },
    };

    try {
        fs.writeFileSync(join(MAPS_DIR, `${id}.json`), JSON.stringify(payload));
        res.status(201).json({ id, name: name.trim() });
    } catch (err) {
        res.status(500).json({ error: 'failed_to_save', message: String(err) });
    }
});

// Serve static resources from the "public" folder
app.use(express.static(PUBLIC_DIR, { index: false }));

// If you don't want people accessing your server stats, comment this line.
app.use('/colyseus', monitor(server as Partial<MonitorOptions>));

// Sert un index.html "templaté" : on remplace __BASE_PATH__ par la valeur réelle
// pour que les chemins (assets, base href, etc.) soient corrects sous le préfixe.
const indexHtmlPath = join(PUBLIC_DIR, 'index.html');
let indexHtmlCache: string | null = null;

function renderIndexHtml(): string {
    if (indexHtmlCache === null) {
        indexHtmlCache = fs.readFileSync(indexHtmlPath, 'utf-8');
    }
    const baseHref = BASE_PATH ? `${BASE_PATH}/` : '/';
    // __BASE_PATH__ inclus dans le HTML est remplacé par "/tosios" sans slash final
    // (les chemins l'écrivent comme "__BASE_PATH__/script.js" pour faire "/tosios/script.js")
    return indexHtmlCache.replace(/__BASE_PATH__/g, BASE_PATH).replace(/__BASE_HREF__/g, baseHref);
}

app.get('*', (_req: any, res: any) => {
    res.type('html').send(renderIndexHtml());
});

server.onShutdown(() => {
    console.log(`Shutting down...`);
});

server.listen(PORT);
console.log(`Listening on ws://localhost:${PORT}${BASE_PATH || ''}`);
console.log(`Custom maps directory: ${MAPS_DIR}`);
if (BASE_PATH) {
    console.log(`Serving with BASE_PATH="${BASE_PATH}"`);
}

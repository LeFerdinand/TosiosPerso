import { RouteComponentProps } from '@reach/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Input, Space } from '../../components';
import { Header } from '../Home/components/Header';
import { BRUSHES, BRUSH_ORDER, BrushId, buildMap, countSpawners, SIZES, SizeKey } from '../../utils/mapTemplates';

interface EditorScreenProps extends RouteComponentProps {}

const MIN_SPAWNERS = 2;

export function EditorScreen({ navigate }: EditorScreenProps) {
    const [size, setSize] = useState<SizeKey>('small');
    const [brush, setBrush] = useState<BrushId>('wall');
    const [name, setName] = useState('Ma carte');
    const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error'; message?: string }>({ kind: 'idle' });
    const isPainting = useRef(false);

    const { width, height } = SIZES[size];
    const total = width * height;

    // Grille initiale : tout en "Sol", bord en "Mur"
    const buildInitialGrid = useCallback((w: number, h: number): BrushId[] => {
        const g: BrushId[] = new Array(w * h).fill('floor');
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
                    g[y * w + x] = 'wall';
                }
            }
        }
        return g;
    }, []);

    const [grid, setGrid] = useState<BrushId[]>(() => buildInitialGrid(width, height));

    // Si on change la taille, on reset la grille
    useEffect(() => {
        setGrid(buildInitialGrid(width, height));
    }, [size, width, height, buildInitialGrid]);

    const spawners = useMemo(() => countSpawners(grid), [grid]);
    const canSave = name.trim().length > 0 && spawners >= MIN_SPAWNERS;

    const paint = (index: number) => {
        setGrid((prev) => {
            if (prev[index] === brush) {
                return prev;
            }
            const next = prev.slice();
            next[index] = brush;
            return next;
        });
    };

    const handleSave = async () => {
        if (!canSave) return;
        setStatus({ kind: 'idle' });
        try {
            const data = buildMap(width, height, grid);
            const res = await fetch('/api/maps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), data }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || `HTTP ${res.status}`);
            }
            const saved = await res.json();
            setStatus({ kind: 'ok', message: `Enregistrée (${saved.id}). Retour à l'accueil pour jouer.` });
        } catch (err) {
            setStatus({ kind: 'error', message: String(err) });
        }
    };

    const handleReset = () => {
        setGrid(buildInitialGrid(width, height));
        setStatus({ kind: 'idle' });
    };

    return (
        <div style={{ position: 'relative', minHeight: '100%', zIndex: 1 }}>
            <Header active="editor" titleSuffix="Éditeur de carte" />

            <main
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '40px 24px 40px',
                    gap: 32,
                }}
            >
                {/* Contrôles */}
                <Box style={{ width: '100%', maxWidth: 720 }}>
                    <label className="field-label">Nom de la carte</label>
                    <Input value={name} maxLength={60} onChange={(e: any) => setName(e.target.value)} />
                    <Space size="s" />

                    <label className="field-label">Taille</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {(Object.keys(SIZES) as SizeKey[]).map((k) => (
                            <button
                                key={k}
                                type="button"
                                className={`nav-tab${size === k ? ' active' : ''}`}
                                onClick={() => setSize(k)}
                            >
                                {SIZES[k].label}
                            </button>
                        ))}
                    </div>
                    <Space size="s" />

                    <label className="field-label">Palette</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {BRUSH_ORDER.map((b) => (
                            <button
                                key={b}
                                type="button"
                                className={`nav-tab${brush === b ? ' active' : ''}`}
                                onClick={() => setBrush(b)}
                                title={BRUSHES[b].label}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: 14,
                                        height: 14,
                                        backgroundColor: BRUSHES[b].color,
                                        boxShadow: '0 0 0 2px #000',
                                        marginRight: 8,
                                        verticalAlign: 'middle',
                                    }}
                                />
                                {BRUSHES[b].label}
                            </button>
                        ))}
                    </div>
                    <Space size="s" />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 16,
                            flexWrap: 'wrap',
                        }}
                    >
                        <div style={{ fontSize: 13, letterSpacing: 1, color: spawners >= MIN_SPAWNERS ? 'var(--text-green)' : 'var(--text-error)' }}>
                            SPAWNS : {spawners} / {MIN_SPAWNERS} MINIMUM
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                type="button"
                                className="pixel-btn-sm neutral"
                                onClick={handleReset}
                            >
                                Réinitialiser
                            </button>
                            <button
                                type="button"
                                className="pixel-btn-sm"
                                onClick={handleSave}
                                disabled={!canSave}
                                style={canSave ? undefined : { opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                Enregistrer
                            </button>
                            <button
                                type="button"
                                className="pixel-btn-sm danger"
                                onClick={() => navigate && navigate('/')}
                            >
                                Quitter
                            </button>
                        </div>
                    </div>

                    {status.kind !== 'idle' && (
                        <>
                            <Space size="xs" />
                            <div
                                style={{
                                    color: status.kind === 'ok' ? 'var(--text-green)' : 'var(--text-error)',
                                    fontSize: 13,
                                    letterSpacing: 1,
                                    textShadow: '1px 1px 0 #000',
                                }}
                            >
                                {status.message}
                            </div>
                        </>
                    )}
                </Box>

                {/* Grille */}
                <Box style={{ width: '100%', maxWidth: 720, overflow: 'auto' }}>
                    <label className="field-label">Édition (clic / glisser pour peindre)</label>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${width}, 1fr)`,
                            gap: 1,
                            backgroundColor: '#000',
                            padding: 2,
                            userSelect: 'none',
                            // taille max raisonnable
                            maxWidth: '100%',
                        }}
                        onMouseLeave={() => (isPainting.current = false)}
                        onMouseUp={() => (isPainting.current = false)}
                    >
                        {grid.map((b, i) => (
                            <div
                                key={i}
                                onMouseDown={() => {
                                    isPainting.current = true;
                                    paint(i);
                                }}
                                onMouseEnter={() => {
                                    if (isPainting.current) paint(i);
                                }}
                                style={{
                                    aspectRatio: '1 / 1',
                                    backgroundColor: BRUSHES[b].color,
                                    cursor: 'crosshair',
                                }}
                            />
                        ))}
                    </div>
                    <Space size="xs" />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>
                        {width} × {height} cases · {total} tuiles
                    </div>
                </Box>
            </main>
        </div>
    );
}

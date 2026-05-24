import React, { useCallback, useEffect, useState } from 'react';
import { Box, Space } from '../../../components';

interface CustomMapMeta {
    id: string;
    name: string;
    width: number;
    height: number;
    createdAt: string | null;
}

interface MyMapsListProps {
    onPlay: (mapId: string) => void;
    /** Bump pour forcer un refresh externe (ex: après création) */
    refreshKey?: number;
}

export function MyMapsList({ onPlay, refreshKey }: MyMapsListProps): React.ReactElement | null {
    const [maps, setMaps] = useState<CustomMapMeta[] | null>(null);

    const load = useCallback(() => {
        fetch('/api/maps')
            .then((r) => r.json())
            .then(setMaps)
            .catch(() => setMaps([]));
    }, []);

    useEffect(() => {
        load();
    }, [load, refreshKey]);

    const handleDelete = async (id: string) => {
        const ok = window.confirm('Supprimer cette carte ?');
        if (!ok) return;
        await fetch(`/api/maps/${id}`, { method: 'DELETE' });
        load();
    };

    // Cache la section tant qu'on n'a pas chargé ou s'il n'y a aucune carte
    if (!maps || maps.length === 0) {
        return null;
    }

    return (
        <Box>
            <div style={styles.title}>Mes cartes</div>
            <Space size="xxs" />
            {maps.map((m, i) => (
                <React.Fragment key={m.id}>
                    <div className="room-row" style={{ alignItems: 'center' }}>
                        <div className="room-row__fields">
                            <div className="room-row__field">
                                <span className="room-row__label">Nom :</span>
                                <span className="room-row__value">{m.name}</span>
                            </div>
                            <div className="room-row__field">
                                <span className="room-row__label">Taille :</span>
                                <span className="room-row__value">
                                    {m.width} × {m.height}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                type="button"
                                className="pixel-btn-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPlay(m.id);
                                }}
                            >
                                Jouer
                            </button>
                            <button
                                type="button"
                                className="pixel-btn-sm danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(m.id);
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                    {i !== maps.length - 1 && <Space size="xxs" />}
                </React.Fragment>
            ))}
        </Box>
    );
}

const styles = {
    title: {
        fontSize: 18,
        fontWeight: 900,
        letterSpacing: 2,
        textTransform: 'uppercase' as const,
        color: 'var(--text-gold)',
        textShadow: '2px 2px 0 #000',
    },
};

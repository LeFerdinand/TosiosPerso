import React from 'react';
import { isMobile } from 'react-device-detect';
import { gameModeLabel, mapLabel } from '../utils/labels';

export function Room(props: {
    id: string;
    roomName: string;
    roomMap: string;
    clients: number;
    maxClients: number;
    mode: string;
    onClick: (id: string) => void;
}): React.ReactElement {
    const { id, roomName, roomMap, clients, maxClients, mode, onClick } = props;

    return (
        <div
            className="room-row"
            style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }}
            onClick={() => onClick(id)}
        >
            <div className="room-row__fields">
                <RoomFieldItem label="Nom" value={roomName || 'Partie inconnue'} />
                <RoomFieldItem label="Joueurs" value={`${clients}/${maxClients}`} />
                <RoomFieldItem label="Carte" value={mapLabel(roomMap)} />
                <RoomFieldItem label="Mode" value={gameModeLabel(mode)} />
            </div>

            <button
                type="button"
                className="pixel-btn-sm"
                style={{ width: isMobile ? '100%' : 'auto' }}
                onClick={(event) => {
                    event.stopPropagation();
                    onClick(id);
                }}
            >
                Rejoindre
            </button>
        </div>
    );
}

export function RoomFieldItem(props: { title?: string; content?: string; label?: string; value?: string }) {
    // Compat: also support the old (title/content) signature used by HUD/Leaderboard
    const label = props.label ?? props.title ?? '';
    const value = props.value ?? props.content ?? '';

    return (
        <div className="room-row__field">
            <span className="room-row__label">{label}:</span>
            <span className="room-row__value">{value}</span>
        </div>
    );
}

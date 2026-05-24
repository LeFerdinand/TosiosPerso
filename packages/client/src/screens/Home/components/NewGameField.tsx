import { Constants } from '@tosios/common';
import { GameMode } from '@tosios/common/src/types';
import React, { useState } from 'react';
import { Button, Input, ListItem, Select, Space, View } from '../../../components';
import { gameModeLabel, mapLabel } from '../../../utils/labels';

const MapsList: ListItem[] = Constants.MAPS_NAMES.map((value) => ({
    value,
    title: mapLabel(value),
}));

const PlayersCountList: ListItem[] = Constants.ROOM_PLAYERS_SCALES.map((value) => ({
    value,
    title: `${value} joueurs`,
}));

const GameModesList: ListItem[] = Constants.GAME_MODES.map((value) => ({
    value,
    title: gameModeLabel(value),
}));

interface NewGameFieldProps {
    onCreate: (name: string, maxPlayers: number, map: string, mode: string) => void;
}

export function NewGameField({ onCreate }: NewGameFieldProps) {
    const [opened, setOpened] = useState(false);
    const [name, setName] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(PlayersCountList[0].value);
    const [map, setMap] = useState(MapsList[0].value);
    const [mode, setMode] = useState<GameMode>(GameModesList[0].value);

    function handleRoomNameChange(event: any) {
        const roomName = event.target.value;
        localStorage.setItem('roomName', roomName);
        setName(roomName);
    }

    function handleCreate() {
        onCreate(name, maxPlayers, map, mode);
    }

    function handleCancel() {
        setOpened(false);
    }

    if (!opened) {
        return (
            <Button
                title="Créer une nouvelle partie"
                text="+ Nouvelle partie"
                onClick={() => setOpened(true)}
            />
        );
    }

    return (
        <View style={{ width: '100%' }}>
            <label className="field-label">Nom de la partie</label>
            <Input
                placeholder="Nom"
                value={name}
                maxLength={Constants.ROOM_NAME_MAX}
                onChange={handleRoomNameChange}
            />
            <Space size="s" />

            <label className="field-label">Carte</label>
            <Select
                value={map}
                values={MapsList}
                onChange={(event: any) => {
                    setMap(event.target.value);
                }}
            />
            <Space size="s" />

            <label className="field-label">Joueurs max</label>
            <Select
                value={maxPlayers}
                values={PlayersCountList}
                onChange={(event: any) => {
                    setMaxPlayers(event.target.value);
                }}
            />
            <Space size="s" />

            <label className="field-label">Mode de jeu</label>
            <Select
                value={mode}
                values={GameModesList}
                onChange={(event: any) => {
                    setMode(event.target.value);
                }}
            />
            <Space size="s" />

            <View style={{ display: 'flex', gap: 12 }}>
                <Button title="Créer la partie" text="Créer" onClick={handleCreate} />
                <Button title="Annuler" text="Annuler" reversed onClick={handleCancel} />
            </View>
        </View>
    );
}

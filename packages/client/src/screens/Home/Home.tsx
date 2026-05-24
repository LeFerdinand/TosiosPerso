import { RouteComponentProps } from '@reach/router';
import { Constants, Types } from '@tosios/common';
import { GameMode } from '@tosios/common/src/types';
import { Client } from 'colyseus.js';
import { RoomAvailable } from 'colyseus.js/lib/Room';
import qs from 'querystringify';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Separator, Space } from '../../components';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NameField } from './components/NameField';
import { NewGameField } from './components/NewGameField';
import { RoomsList } from './components/RoomsList';

interface HomeScreenProps extends RouteComponentProps {}

export function HomeScreen({ navigate }: HomeScreenProps) {
    const [rooms, setRooms] = useState<Array<RoomAvailable<any>>>([]);
    const clientRef = useRef<Client>();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        try {
            const host = window.document.location.host.replace(/:.*/, '');
            const port = process.env.NODE_ENV !== 'production' ? Constants.WS_PORT : window.location.port;
            const basePath = process.env.BASE_PATH || '';
            const url = `${window.location.protocol.replace('http', 'ws')}//${host}${port ? `:${port}` : ''}${basePath}`;

            clientRef.current = new Client(url);
            intervalRef.current = setInterval(updateRooms, Constants.ROOM_REFRESH);

            updateRooms();
        } catch (error) {
            console.error(error);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    async function updateRooms() {
        if (!clientRef.current) {
            return;
        }

        const rooms = await clientRef.current.getAvailableRooms(Constants.ROOM_NAME);
        setRooms(rooms);
    }

    function handleRoomCreate(name: string, maxPlayers: number, map: string, mode: GameMode) {
        const playerName = localStorage.getItem('playerName') || '';

        const options: Types.RoomOptions = {
            playerName,
            roomName: name,
            roomMap: map,
            roomMaxPlayers: maxPlayers,
            mode,
        };

        navigate(`/new${qs.stringify(options, true)}`);
    }

    function handleRoomClick(roomId: string) {
        navigate(`/${roomId}`);
    }

    return (
        <div style={{ position: 'relative', minHeight: '100%', zIndex: 1 }}>
            <Header active="jeux" />

            <main
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '40px 24px 24px',
                }}
            >
                <div style={{ width: '100%', maxWidth: 560 }}>
                    <NameField />
                    <Space size="m" />
                    <Box>
                        <NewGameField onCreate={handleRoomCreate} />
                        <Space size="s" />
                        <Separator />
                        <Space size="s" />
                        <RoomsList rooms={rooms} onRoomClick={handleRoomClick} />
                    </Box>
                    <Space size="m" />
                    <Footer />
                </div>
            </main>
        </div>
    );
}

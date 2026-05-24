import { RoomAvailable } from 'colyseus.js';
import React, { Fragment } from 'react';
import { Room, Space } from '../../../components';

interface RoomsListProps {
    rooms: Array<RoomAvailable<any>>;
    onRoomClick: (roomId: string) => void;
}

export function RoomsList({ rooms, onRoomClick }: RoomsListProps) {
    if (!rooms || !rooms.length) {
        return <div className="room-row__empty">Aucune partie pour le moment...</div>;
    }

    return (
        <>
            {rooms.map(({ roomId, metadata, clients, maxClients }, index) => (
                <Fragment key={roomId}>
                    <Room
                        id={roomId}
                        roomName={metadata.roomName}
                        roomMap={metadata.roomMap}
                        clients={clients}
                        maxClients={maxClients}
                        mode={metadata.mode}
                        onClick={onRoomClick}
                    />
                    {index !== rooms.length - 1 && <Space size="xxs" />}
                </Fragment>
            ))}
        </>
    );
}

import { Constants } from '@tosios/common';
import React, { useState } from 'react';
import { Box, Button, Input, Space } from '../../../components';

export function NameField() {
    const [name, setName] = useState(localStorage.getItem('playerName') || '');
    const [changed, setChanged] = useState(false);

    function handleChange(event: any) {
        setName(event.target.value);
        setChanged(true);
    }

    function handleSave() {
        localStorage.setItem('playerName', name);
        setChanged(false);
    }

    return (
        <Box>
            <label className="field-label">Choisissez votre pseudo</label>
            <Input value={name} placeholder="Pseudo" maxLength={Constants.PLAYER_NAME_MAX} onChange={handleChange} />
            {changed && (
                <>
                    <Space size="xs" />
                    <Button title="Enregistrer" text="Enregistrer" onClick={handleSave} />
                </>
            )}
        </Box>
    );
}

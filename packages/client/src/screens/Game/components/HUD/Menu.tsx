import React, { CSSProperties } from 'react';
import { Box, Button, Inline, Input, KeyboardKey, Space, Text, View } from '../../../../components';
import { ArrowLeft } from '../../../../icons';

interface MenuProps {
    onClose?: () => void;
    onLeave?: () => void;
}

export function Menu({ onClose, onLeave }: MenuProps): React.ReactElement {
    const roomURL = window.location.href;
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Copy the room's link to the clipboard
    function copyToClipboard() {
        if (!inputRef.current) {
            return;
        }

        inputRef.current.select();
        window.document.execCommand('copy');
        inputRef.current.blur();
    }

    return (
        <View fullscreen flex center backdrop style={styles.menu}>
            <Box style={styles.box}>
                {/* Share */}
                <Text style={styles.sectionTitle}>Partager</Text>
                <Space size="xxs" />
                <Text style={styles.sectionDescription}>Copiez ce lien pour jouer avec vos amis.</Text>
                <Space size="xxs" />
                <View flex center>
                    <Input ref={inputRef} value={roomURL} />
                    <Inline size="xs" />
                    <Button text="Copier" style={{ width: 'fit-content' }} onClick={copyToClipboard} />
                </View>
                <Space size="m" />

                {/* Keys */}
                <Text style={styles.sectionTitle}>Touches</Text>
                <Space size="xxs" />
                <Text style={styles.sectionDescription}>La liste des touches pour jouer.</Text>
                <Space size="s" />

                {/* Keys: Move */}
                <Text style={styles.sectionKey}>Se déplacer :</Text>
                <Space size="xxs" />
                <View flex>
                    <KeyboardKey value="W" />
                    <Inline size="xxs" />
                    <KeyboardKey value="A" />
                    <Inline size="xxs" />
                    <KeyboardKey value="S" />
                    <Inline size="xxs" />
                    <KeyboardKey value="D" />
                    <Inline size="xxs" />

                    <Text>ou</Text>

                    <Inline size="xxs" />
                    <KeyboardKey value="↑" />
                    <Inline size="xxs" />
                    <KeyboardKey value="←" />
                    <Inline size="xxs" />
                    <KeyboardKey value="↓" />
                    <Inline size="xxs" />
                    <KeyboardKey value="→" />
                </View>
                <Space size="s" />

                {/* Keys: Aim */}
                <Text style={styles.sectionKey}>Viser :</Text>
                <Space size="xxs" />
                <View flex>
                    <KeyboardKey value="Souris" />
                </View>
                <Space size="s" />

                {/* Keys: Shoot */}
                <Text style={styles.sectionKey}>Tirer :</Text>
                <Space size="xxs" />
                <View flex>
                    <KeyboardKey value="Clic gauche" />
                    <Inline size="xxs" />

                    <Text>ou</Text>

                    <Inline size="xxs" />
                    <KeyboardKey value="Espace" />
                </View>
                <Space size="s" />

                {/* Keys: Leaderboard */}
                <Text style={styles.sectionKey}>Classement :</Text>
                <Space size="xxs" />
                <View flex>
                    <KeyboardKey value="Tab" />
                </View>
                <Space size="s" />

                {/* Keys: Menu */}
                <Text style={styles.sectionKey}>Menu :</Text>
                <Space size="xxs" />
                <View flex>
                    <KeyboardKey value="Échap" />
                </View>
                <Space size="m" />

                <View flex>
                    <Button onClick={onLeave} icon={ArrowLeft}>
                        Quitter
                    </Button>
                    <Inline size="xxs" />
                    <Button reversed onClick={onClose}>
                        Fermer
                    </Button>
                </View>
            </Box>
        </View>
    );
}

const styles: { [key: string]: CSSProperties } = {
    menu: {
        position: 'fixed',
        padding: 16,
        zIndex: 1000,
        pointerEvents: 'all',
    },
    box: {
        boxSizing: 'border-box',
        maxHeight: '100%',
        maxWidth: 500,
        overflowY: 'scroll',
    },
    sectionTitle: {
        color: 'black',
        fontSize: 18,
    },
    sectionDescription: {
        color: '#A9A9A9',
    },
    sectionKey: {
        fontSize: 14,
    },
};

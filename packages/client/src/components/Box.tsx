import React, { CSSProperties, ReactNode } from 'react';

const BOX: CSSProperties = {
    padding: 28,
    overflow: 'visible',
};

export function Box(props: { style?: CSSProperties; children: ReactNode }): React.ReactElement {
    const { style, children } = props;

    return (
        <div
            className="pixel-frame"
            style={{
                ...BOX,
                ...style,
            }}
        >
            {children}
            <span className="pixel-corner bl" />
            <span className="pixel-corner br" />
        </div>
    );
}

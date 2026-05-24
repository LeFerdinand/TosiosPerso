import React, { CSSProperties } from 'react';

const HORIZONTAL: CSSProperties = {
    height: 3,
    minHeight: 3,
    width: '100%',
    backgroundColor: 'var(--gold-shadow)',
    boxShadow: '0 2px 0 0 #000',
};

const VERTICAL: CSSProperties = {
    width: 3,
    minWidth: 3,
    backgroundColor: 'var(--gold-shadow)',
    boxShadow: '2px 0 0 0 #000',
    display: 'inline-block',
};

export function Separator(props: { mode?: 'vertical' | 'horizontal' }): React.ReactElement {
    const { mode = 'horizontal' } = props;

    return <div style={mode === 'horizontal' ? HORIZONTAL : VERTICAL} />;
}

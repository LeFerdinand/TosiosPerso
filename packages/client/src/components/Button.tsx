import React, { CSSProperties, ReactNode } from 'react';
import { Inline } from './Inline';

export function Button(props: {
    type?: 'button' | 'submit' | 'reset';
    text?: string;
    children?: ReactNode;
    style?: CSSProperties;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    title?: string;
    reversed?: boolean;
    onClick?: () => void;
}): React.ReactElement {
    const { type = 'button', text, children, style, icon: Icon, title, reversed = false, onClick } = props;

    // `reversed` = bouton secondaire (annuler/fermer) -> rouge ; sinon vert
    const className = reversed ? 'pixel-btn-sm danger' : 'pixel-btn-sm';

    return (
        <button
            type={type}
            className={className}
            style={{
                width: '100%',
                minHeight: 48,
                ...style,
            }}
            title={title}
            onClick={onClick}
        >
            {Icon && (
                <>
                    <Icon />
                    <Inline size="xxs" />
                </>
            )}
            {text || children}
        </button>
    );
}

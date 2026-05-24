import React, { CSSProperties, SyntheticEvent } from 'react';

export const Input = React.forwardRef(
    (
        props: {
            value?: string;
            placeholder?: string;
            maxLength?: number;
            style?: CSSProperties;
            onChange?: (event: SyntheticEvent) => void;
        },
        ref: any,
    ): React.ReactElement => {
        const { value, placeholder, style, maxLength, onChange } = props;

        return (
            <input
                ref={ref}
                type="text"
                className="pixel-input"
                value={value}
                style={style}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={onChange}
            />
        );
    },
);

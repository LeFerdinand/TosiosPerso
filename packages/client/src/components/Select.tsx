import React, { CSSProperties, SyntheticEvent } from 'react';

export interface ListItem {
    value: string | number;
    title: string;
}

export function Select(props: {
    value?: any;
    values: ListItem[];
    style?: CSSProperties;
    onChange?: (event: SyntheticEvent) => void;
}): React.ReactElement {
    const { value, values = [], style, onChange } = props;

    const list = values.map((item) => (
        <option key={item.value} value={item.value}>
            {item.title}
        </option>
    ));

    return (
        <select className="pixel-select" style={style} value={value} onChange={onChange}>
            {list}
        </select>
    );
}

import React from 'react';
import { version } from '../../../../../../package.json';
import { GitHubIcon } from '../../../icons';

const URL = 'https://github.com/LeFerdinand/TosiosPerso';

export function Footer(): React.ReactElement {
    return (
        <a href={URL}>
            <div
                className="site-footer"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                }}
            >
                <GitHubIcon />
                <span>GITHUB (v{version})</span>
            </div>
        </a>
    );
}

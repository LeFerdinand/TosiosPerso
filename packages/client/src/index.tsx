import * as PIXI from 'pixi.js';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './styles/pixel-theme.css';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

ReactDOM.render(<App />, document.getElementById('root'));

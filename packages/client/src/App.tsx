import { LocationProvider, Router } from '@reach/router';
import React from 'react';
import { EditorScreen } from './screens/Editor/Editor';
import { GameScreen } from './screens/Game/Game';
import { HomeScreen } from './screens/Home/Home';

const BASE_PATH = process.env.BASE_PATH || '';

export default function App(): React.ReactElement {
    return (
        <LocationProvider>
            <RoutedApp />
        </LocationProvider>
    );
}

function RoutedApp(): React.ReactElement {
    return (
        <Router basepath={BASE_PATH || undefined}>
            <HomeScreen default path="/" />
            <EditorScreen path="/editor" />
            <GameScreen path="/:roomId" />
        </Router>
    );
}

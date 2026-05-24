import { Link } from '@reach/router';
import { Constants } from '@tosios/common';
import React from 'react';
import { Helmet } from 'react-helmet';

interface HeaderProps {
    active?: 'jeux' | 'editor';
    titleSuffix?: string;
}

export function Header({ active = 'jeux', titleSuffix = 'Accueil' }: HeaderProps): React.ReactElement {
    return (
        <>
            <Helmet>
                <title>{`${Constants.APP_TITLE} - ${titleSuffix}`}</title>
                <meta
                    name="description"
                    content="Tosios la Tanière — jeu multijoueur open-source dans le navigateur."
                />
            </Helmet>

            <header className="site-header">
                <a className="site-brand" href="https://lataniereplay.fr/">
                    <span className="site-brand__title">Tosios</span>
                    <span className="site-brand__tagline">La Tanière</span>
                </a>

                <nav className="site-nav">
                    <Link to="/" className={`nav-tab${active === 'jeux' ? ' active' : ''}`}>
                        Jeux
                    </Link>
                    {/* Bouton "Créateur de map" masqué pour le moment.
                        L'éditeur reste accessible directement via /editor. */}
                </nav>
            </header>
        </>
    );
}

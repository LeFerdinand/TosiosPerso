// Helpers de traduction pour les valeurs techniques affichées dans l'UI.
// Les valeurs (mode/map/team) restent en anglais côté logique afin de ne pas
// casser les comparaisons côté serveur ; seul l'affichage est francisé.

export function gameModeLabel(mode: string): string {
    switch (mode) {
        case 'deathmatch':
            return 'Match à mort';
        case 'team deathmatch':
            return 'Match à mort en équipe';
        default:
            return mode;
    }
}

export function mapLabel(map: string): string {
    switch (map) {
        case 'small':
            return 'Petite';
        case 'gigantic':
            return 'Gigantesque';
        default:
            return map;
    }
}

export function teamLabel(team: string): string {
    switch (team) {
        case 'Red':
            return 'Rouge';
        case 'Blue':
            return 'Bleue';
        default:
            return team;
    }
}

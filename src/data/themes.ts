// Theme configuration for custom trails
// Adding a new theme = adding an entry here + icon SVGs on frontend

export interface ThemeIcon {
    name: string;
    colour: string;
}

export interface ThemeConfig {
    label: string;
    description: string;
    icons: ThemeIcon[];
    defaultIcon: string;
}

export const THEMES: Record<string, ThemeConfig> = {
    easter: {
        label: 'Easter Egg Hunt',
        description: 'Hide eggs for friends and family to find!',
        icons: [
            { name: 'egg_red', colour: 'red' },
            { name: 'egg_blue', colour: 'blue' },
            { name: 'egg_green', colour: 'green' },
            { name: 'egg_gold', colour: 'gold' },
            { name: 'egg_orange', colour: 'orange' },
            { name: 'basket', colour: 'green' },
            { name: 'treasure_chest', colour: 'gold' },
            { name: 'question_mark', colour: 'purple' },
        ],
        defaultIcon: 'egg_red'
    },
    valentine: {
        label: "Valentine's Trail",
        description: 'Create a romantic treasure hunt for your loved one',
        icons: [
            { name: 'heart_red', colour: 'red' },
            { name: 'heart_pink', colour: 'pink' },
            { name: 'rose', colour: 'red' },
            { name: 'love_letter', colour: 'pink' },
            { name: 'treasure_chest', colour: 'gold' },
            { name: 'question_mark', colour: 'purple' },
        ],
        defaultIcon: 'heart_red'
    },
    general: {
        label: 'Treasure Hunt',
        description: 'A custom scavenger hunt for any occasion',
        icons: [
            { name: 'pin', colour: 'red' },
            { name: 'treasure_chest', colour: 'gold' },
            { name: 'star', colour: 'gold' },
            { name: 'question_mark', colour: 'purple' },
            { name: 'flag', colour: 'green' },
        ],
        defaultIcon: 'pin'
    }
};

export const VALID_THEMES = Object.keys(THEMES);

import { Scene, Clickable, Item } from './types';

export const scenes: Scene[] = [
    {
        id: 1,
        name: 'start',
        image: 'img/scenes/1/scene.jpg',
        clickables: [
            {
                id: 1,
                image: 'img/scenes/1/clickables/1.png',
                left: 100,
                top: 300,
                item: 1
            },
            {
                id: 2,
                image: 'img/scenes/1/clickables/2.png',
                left: 500,
                top: 200,
                message: 'Look out',
                scene: 2
            }
        ]
    },
    {
        id: 2,
        name: 'hall',
        image: 'img/scenes/2/scene.jpg',
        clickables: [
            {
                id: 2,
                image: 'img/scenes/1/clickables/2.png',
                left: 100,
                top: 400,
                scene: 1
            }
        ]
    }
];

export const items: Item[] = [
    {
        id: 1,
        name: 'key',
        image: 'img/items/key.png'
    },
    {
        id: 2,
        name: 'hammer',
        image: 'img/items/hammer.png'
    }
];


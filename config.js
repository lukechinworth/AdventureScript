export const scenes = [
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
                acquireItem: 1
            },
            {
                id: 2,
                image: 'img/scenes/1/clickables/2.png',
                left: 500,
                top: 200,
                scene: 2
            }
        ]
    }
];

export const items = [
    {
        id: 1,
        name: 'key'
    }
];


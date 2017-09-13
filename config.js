/**
 * @typedef {Object} Clickable
 * @property {Number} id
 * @property {String} image
 * @property {Number} left
 * @property {Number} top
 * @property {String} message Message that appears when clicked
 * @property {Number} item Id of item acquired when clicked
 * @property {Number} scene Id of scene to go to when clicked
 *
 * @typedef {Object} Scene
 * @property {Number} id
 * @property {String} name
 * @property {String} image
 * @property {Array<Clickable>} clickables
 */
/** @type {Array<Scene>} */
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

export const items = [
    {
        id: 1,
        name: 'key'
    }
];


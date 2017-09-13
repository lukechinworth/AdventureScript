import { scenes, items } from './config.js';
import {
    getPositionRelativeToCanvas,
    getImageData,
    loadImage,
    pointIsInRect,
    pointIsInImageContent
} from './functions.js';

const FRAMES_PER_SECOND = 30;
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let scene = scenes[0];

canvas.addEventListener('click', function(e) {
    const { x, y } = getPositionRelativeToCanvas({ x: e.clientX, y: e.clientY, canvas });

    scene.clickables.forEach(c => {
        const left = c.left;
        const top = c.top;
        const { width, height } = c.image;

        if (!pointIsInRect({ x, y, left, top, width, height })) {
            return;
        }

        const { data } = c.imageData;

        if (!pointIsInImageContent({ x, y, left, top, width, data })) {
            return;
        }

        console.log(`clicked ${c.id}`);
    });
});

// load assets
Promise.all([
    scene.image,
    ...scene.clickables.map(c => c.image)
].map(loadImage))
    .then(([sceneImage, ...clickableImages]) => {
        scene.image = sceneImage;

        for (let i = 0; i < scene.clickables.length; i++) {
            scene.clickables[i].image = clickableImages[i];
            scene.clickables[i].imageData = getImageData(clickableImages[i]);
        }

        setInterval(loop, 1000/FRAMES_PER_SECOND)
    });

function loop() {
    // move();
    draw();
}

function draw() {
    context.drawImage(scene.image, 0, 0);

    scene.clickables.forEach(c => {
        context.drawImage(c.image, c.left, c.top);
    });
}

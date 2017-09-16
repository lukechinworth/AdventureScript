import { scenes, items } from './config';
import {
    getPositionRelativeToCanvas,
    getImageData,
    loadImage,
    pointIsInRect,
    pointIsInImageContent,
    populateSceneWithImages
} from './functions';

const FRAMES_PER_SECOND: number = 30;
const root = document.getElementById('root');
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
root.appendChild(canvas);
const context = canvas.getContext('2d');

let scene = scenes[0];
let inventory: Array<number> = [];

canvas.addEventListener('click', function(e) {
    const { x, y } = getPositionRelativeToCanvas({ x: e.clientX, y: e.clientY, canvas });

    scene.clickables.forEach(c => {
        const left = c.left;
        const top = c.top;
        const { width, height } = c.img;

        if (!pointIsInRect({ x, y, left, top, width, height })) {
            return;
        }

        const { data } = c.imageData;

        if (!pointIsInImageContent({ x, y, left, top, width, data })) {
            return;
        }

        if (c.scene) {
            const newScene = scenes.find(s => s.id === c.scene);

            populateSceneWithImages(newScene)
                .then(() => {
                    scene = newScene;
                });
        }
    });
});

populateSceneWithImages(scene)
    .then(() => {
        setInterval(loop, 1000/FRAMES_PER_SECOND)
    });

function loop(): void {
    // move();
    draw();
}

function draw(): void {
    context.drawImage(scene.img, 0, 0);

    scene.clickables.forEach(c => {
        context.drawImage(c.img, c.left, c.top);
    });
}

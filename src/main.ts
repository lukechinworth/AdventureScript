import { Scene, Clickable, Position } from './types.js';
import { scenes, items } from './config.js';
import {
    getPositionRelativeToCanvas,
    getImageData,
    pointIsInRect,
    pointIsInImageContent,
    populateSceneWithImages
} from './functions.js';

// setup
const root: HTMLDivElement = document.getElementById('root') as HTMLDivElement;
const canvas: HTMLCanvasElement = document.createElement('canvas');
const context: CanvasRenderingContext2D = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;
root.appendChild(canvas);

// constants
const FRAMES_PER_SECOND: number = 30;

// variables
let scene: Scene = scenes[0];
let inventory: number[] = [];

canvas.addEventListener('click', function(e) {
    const { x, y }: Position = getPositionRelativeToCanvas(e.clientX, e.clientY, canvas);

    scene.clickables.forEach((c: Clickable) => {
        const left: number = c.left;
        const top: number = c.top;
        const { width, height }: HTMLImageElement = c.img;

        if (!pointIsInRect(x, y, left, top, width, height)) {
            return;
        }

        const { data }: ImageData = c.imageData;

        if (!pointIsInImageContent(x, y, left, top, width, data)) {
            return;
        }

        if (c.scene) {
            const newScene: Scene = scenes.find((s: Scene) => s.id === c.scene);

            populateSceneWithImages(newScene)
                .then(() => {
                    scene = newScene;
                });
        }
    });
});

populateSceneWithImages(scene)
    .then(() => {
        requestAnimationFrame(loop);
    });

function loop(): void {
    // move();
    draw();
    requestAnimationFrame(loop);
}

function draw(): void {
    context.drawImage(scene.img, 0, 0);

    scene.clickables.forEach(c => {
        context.drawImage(c.img, c.left, c.top);
    });
}

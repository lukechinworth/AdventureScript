import { scenes, items } from './config.js';
import {
    getEventPositionOnCanvas,
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
/** @type {HTMLImageElement} */
let sceneImage;
/** @type {HTMLImageElement} */
let clickableImage;
/** @type {ImageData} */
let clickableImageData;

canvas.addEventListener('click', function(e) {
    const { x, y } = getEventPositionOnCanvas({ e, canvas });    
    const left = 100;
    const top = 100;
    const { width, height } = clickableImage;

    if (!pointIsInRect({ x, y, left, top, width, height })) {
        return;
    }

    const { data } = clickableImageData;

    if (!pointIsInImageContent({ x, y, left, top, width, data })) {
        return;
    }

    console.log('clicked in content');            
});

// load assets
Promise.all([
    `/img/scenes/1.jpg`,
    `/img/clickables/1.png`
].map(loadImage))
    .then(([scene, clickable]) => {
        sceneImage = scene;
        clickableImage = clickable;
        clickableImageData = getImageData(clickable);

        setInterval(loop, 1000/FRAMES_PER_SECOND)
    });

function loop() {
    // move();
    draw();
}

function draw() {    
    context.drawImage(sceneImage, 0, 0);
    context.drawImage(clickableImage, 100, 100);
}

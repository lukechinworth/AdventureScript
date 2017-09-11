import { scenes, items } from './config.js';
import { getImage, getImageData, pointIsInImage } from './image.js';

const FRAMES_PER_SECOND = 30;
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

/* maybe load up assets into an array 
[ 
    {
        id: 1,
        image: loaded Image,
        imageData: loaded ImageData
    }
]
*/
let sceneImage;
let clickableImage;
let clickableImageData;

canvas.addEventListener('click', function(e) {
    const mousePosition = getMousePosition(e);

    if (pointIsInImage(mousePosition.x, mousePosition.y, clickableImage)) {
        console.log('clicked in image');
    }

    console.log('clicked canvas');
});

// load assets
Promise.all([
    `/img/scenes/1.jpg`,
    `/img/clickables/1.png`
].map(getImage))
    .then(([scene, clickable]) => {
        sceneImage = scene;
        clickableImage = clickable;
        clickableImageData = getImageData(clickable);

        setInterval(draw, 1000/FRAMES_PER_SECOND)
    });

function draw() {    
    context.drawImage(sceneImage, 0, 0);
    context.drawImage(clickableImage, 100, 100);
}

function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseX = e.clientX - rect.left - root.scrollLeft;
    const mouseY = e.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    };
}

define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.scenes = [
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
    exports.items = [
        {
            id: 1,
            name: 'key'
        }
    ];
});
define("functions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPositionRelativeToCanvas = ({ x, y, canvas }) => {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        const relativeX = x - rect.left - root.scrollLeft;
        const relativeY = y - rect.top - root.scrollTop;
        return {
            x: relativeX,
            y: relativeY
        };
    };
    exports.getImageData = (img) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        // draw the image on the temporary canvas
        context.drawImage(img, 0, 0);
        // pull the entire image into an array of pixel data
        return context.getImageData(0, 0, img.width, img.height);
    };
    exports.loadImage = (uri) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = e => {
            reject(e);
        };
        img.src = uri;
    });
    exports.loadSceneImages = (scene) => Promise.all([
        scene.image,
        ...scene.clickables.map(c => c.image)
    ].map(exports.loadImage))
        .then(([sceneImage, ...clickableImages]) => {
        scene.img = sceneImage;
        for (let i = 0; i < scene.clickables.length; i++) {
            scene.clickables[i].img = clickableImages[i];
            scene.clickables[i].imageData = exports.getImageData(clickableImages[i]);
        }
    });
    exports.pointIsInRect = ({ x, y, left, top, width, height }) => x > left
        && x < left + width
        && y > top
        && y < top + height;
    exports.pointIsInImageContent = ({ x, y, left, top, width, data }) => {
        const imageXY = getPositionRelativeToPosition({ x, y, left, top });
        const pixelNumber = getImageDataPixelNumber({ x: imageXY.x, y: imageXY.y, width });
        const imageDataPixelData = getImageDataPixelData({ pixelNumber, data });
        const pixelOpacity = getPixelOpacity(imageDataPixelData);
        return isGreaterThanZero(pixelOpacity);
    };
    function getPositionRelativeToPosition({ x, y, left, top }) {
        return {
            x: x - left,
            y: y - top
        };
    }
    function getImageDataPixelNumber({ x, y, width }) {
        return (y - 1) * width + x;
    }
    function getImageDataPixelData({ pixelNumber, data }) {
        const start = pixelNumber * 4 - 4;
        return data.slice(start, start + 4);
    }
    function getPixelOpacity(pixelData) {
        return pixelData[3];
    }
    function isGreaterThanZero(number) {
        return number > 0;
    }
});
define("main", ["require", "exports", "config", "functions"], function (require, exports, config_1, functions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const FRAMES_PER_SECOND = 30;
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    let scene = config_1.scenes[0];
    canvas.addEventListener('click', function (e) {
        const { x, y } = functions_1.getPositionRelativeToCanvas({ x: e.clientX, y: e.clientY, canvas });
        scene.clickables.forEach(c => {
            const left = c.left;
            const top = c.top;
            const { width, height } = c.img;
            if (!functions_1.pointIsInRect({ x, y, left, top, width, height })) {
                return;
            }
            const { data } = c.imageData;
            if (!functions_1.pointIsInImageContent({ x, y, left, top, width, data })) {
                return;
            }
            console.log(`clicked ${c.id}`);
            if (c.scene) {
                const newScene = config_1.scenes.find(s => s.id === c.scene);
                functions_1.loadSceneImages(newScene)
                    .then(() => {
                    scene = newScene;
                });
            }
        });
    });
    functions_1.loadSceneImages(scene)
        .then(() => {
        setInterval(loop, 1000 / FRAMES_PER_SECOND);
    });
    function loop() {
        // move();
        draw();
    }
    function draw() {
        context.drawImage(scene.img, 0, 0);
        scene.clickables.forEach(c => {
            context.drawImage(c.img, c.left, c.top);
        });
    }
});

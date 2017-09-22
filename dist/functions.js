export const getPositionRelativeToCanvas = (x, y, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const relativeX = x - rect.left - root.scrollLeft;
    const relativeY = y - rect.top - root.scrollTop;
    return {
        x: relativeX,
        y: relativeY
    };
};
export const getImageData = (img) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, img.width, img.height);
};
const loadImage = (uri) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
        resolve(img);
    };
    img.onerror = (e) => {
        reject(e);
    };
    img.src = uri;
});
const loadSceneImages = (scene) => Promise.all([
    scene.image,
    ...scene.clickables.map(c => c.image)
].map(loadImage));
export const populateSceneWithImages = (scene) => loadSceneImages(scene)
    .then(([sceneImage, ...clickableImages]) => {
    scene.img = sceneImage;
    for (let i = 0; i < scene.clickables.length; i++) {
        scene.clickables[i].img = clickableImages[i];
        scene.clickables[i].imageData = getImageData(clickableImages[i]);
    }
});
export const pointIsInRect = (x, y, left, top, width, height) => x > left
    && x < left + width
    && y > top
    && y < top + height;
export const pointIsInImageContent = (x, y, left, top, width, data) => {
    const imageXY = getPositionRelativeToPosition(x, y, left, top);
    const pixelNumber = getImageDataPixelNumber(imageXY.x, imageXY.y, width);
    const imageDataPixelData = getImageDataPixelData(pixelNumber, data);
    const pixelOpacity = getPixelOpacity(imageDataPixelData);
    return isGreaterThanZero(pixelOpacity);
};
function getPositionRelativeToPosition(x, y, left, top) {
    return {
        x: x - left,
        y: y - top
    };
}
function getImageDataPixelNumber(x, y, width) {
    return (y - 1) * width + x;
}
function getImageDataPixelData(pixelNumber, data) {
    const start = pixelNumber * 4 - 4;
    return data.slice(start, start + 4);
}
function getPixelOpacity(pixelData) {
    return pixelData[3];
}
function isGreaterThanZero(number) {
    return number > 0;
}

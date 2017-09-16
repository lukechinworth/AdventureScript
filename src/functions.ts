import { Scene, Clickable, Position } from './types';

interface getPositionRelativeToCanvasOptions {
    x: number;
    y: number;
    canvas: HTMLCanvasElement;
}
export const getPositionRelativeToCanvas = ({ x, y, canvas }: getPositionRelativeToCanvasOptions): Position => {
    const rect: ClientRect = canvas.getBoundingClientRect();
    const root: HTMLElement = document.documentElement;
    const relativeX: number = x - rect.left - root.scrollLeft;
    const relativeY: number = y - rect.top - root.scrollTop;

    return {
        x: relativeX,
        y: relativeY
    };
};

export const getImageData = (img: HTMLImageElement): ImageData => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    // draw the image on the temporary canvas
    context.drawImage(img, 0, 0);

    // pull the entire image into an array of pixel data
    return context.getImageData(0, 0, img.width, img.height);
};

const loadImage = (uri: string): Promise<HTMLImageElement> => new Promise((resolve: (img: HTMLImageElement) => void, reject: (e: ErrorEvent) => void) => {
    const img: HTMLImageElement = new Image();

    img.onload = () => {
        resolve(img);
    };

    img.onerror = (e: ErrorEvent) => {
        reject(e);
    };

    img.src = uri;
});

const loadSceneImages = (scene: Scene): Promise<HTMLImageElement[]> => Promise.all([
    scene.image,
    ...scene.clickables.map(c => c.image)
].map(loadImage));

export const populateSceneWithImages = (scene: Scene): Promise<void> => loadSceneImages(scene)
    .then(([sceneImage, ...clickableImages]) => {
        scene.img = sceneImage;

        for (let i = 0; i < scene.clickables.length; i++) {
            scene.clickables[i].img = clickableImages[i];
            scene.clickables[i].imageData = getImageData(clickableImages[i]);
        }
    });

interface PointIsInRectOptions {
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
    height: number;
}
export const pointIsInRect = ({ x, y, left, top, width, height }: PointIsInRectOptions): boolean => x > left
    && x < left + width
    && y > top
    && y < top + height;

interface PointIsInImageContentOptions {
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
    data: Uint8ClampedArray;
}
export const pointIsInImageContent = ({ x, y, left, top, width, data }: PointIsInImageContentOptions): boolean => {
    const imageXY: Position = getPositionRelativeToPosition({ x, y, left, top });
    const pixelNumber: number = getImageDataPixelNumber({ x: imageXY.x, y: imageXY.y, width });
    const imageDataPixelData: Uint8ClampedArray = getImageDataPixelData({ pixelNumber, data })
    const pixelOpacity: number = getPixelOpacity(imageDataPixelData);

    return isGreaterThanZero(pixelOpacity);
};

interface GetRelativePositionOptions {
    x: number;
    y: number;
    left: number;
    top: number;
}
function getPositionRelativeToPosition({ x, y, left, top }: GetRelativePositionOptions): Position {
    return {
        x: x - left,
        y: y - top
    };
}

interface GetImageDataPixelNumberOptions {
    x: number;
    y: number;
    width: number;
}
function getImageDataPixelNumber({ x, y, width }: GetImageDataPixelNumberOptions): number {
    return (y - 1) * width + x;
}

interface GetImageDataPixelDataOptions {
    pixelNumber: number;
    data: Uint8ClampedArray;
}
function getImageDataPixelData({ pixelNumber, data }: GetImageDataPixelDataOptions): Uint8ClampedArray {
    const start: number = pixelNumber * 4 - 4;

    return data.slice(start, start + 4);
}

function getPixelOpacity(pixelData: Uint8ClampedArray): number {
    return pixelData[3];
}

function isGreaterThanZero(number: number): boolean {
    return number > 0;
}

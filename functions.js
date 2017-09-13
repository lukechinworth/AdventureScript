/**
 * @typedef {Object} getPositionRelativeToCanvasArg
 * @property {Number} x
 * @property {Number} y
 * @property {HTMLCanvasElement} canvas
 *
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 *
 * @returns {Position}
 */
export const getPositionRelativeToCanvas = (/** @type {getPositionRelativeToCanvasArg} */ { x, y, canvas }) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const relativeX = x - rect.left - root.scrollLeft;
    const relativeY = y - rect.top - root.scrollTop;

    return {
        x: relativeX,
        y: relativeY
    };
};

/**
 * @param {Image} img
 *
 * @returns {ImageData}
 */
export const getImageData = img => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    // draw the image on the temporary canvas
    context.drawImage(img, 0, 0);

    // pull the entire image into an array of pixel data
    return context.getImageData(0, 0, img.width, img.height);
};

/**
 * @param {String} uri
 *
 * @returns {Promise<Image>}
 */
export const loadImage = uri => new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
        resolve(img);
    };

    img.onerror = e => {
        reject(e);
    };

    img.src = uri;
});

/**
 * @typedef {Object} PointIsInRectArg
 * @property {Number} x
 * @property {Number} y
 * @property {Number} left
 * @property {Number} top
 * @property {Number} width
 * @property {Number} height
 *
 * @returns {Boolean}
 */
export const pointIsInRect = (/** @type {PointIsInRectArg} */ { x, y, left, top, width, height }) => x > left
    && x < left + width
    && y > top
    && y < top + height;

/**
 * @typedef {Object} PointIsInImageContentArg
 * @property {Number} x
 * @property {Number} y
 * @property {Number} left
 * @property {Number} top
 * @property {Number} width
 * @property {Number} height
 * @property {Uint8ClampedArray} data - ImageData
 *
 * @returns {Boolean} Opacity is greater than 0
 */
export const pointIsInImageContent = (/** @type {PointIsInImageContentArg} */ { x, y, left, top, width, data }) => {
    const imageXY = getPositionRelativeToPosition({ x, y, left, top });
    const pixelNumber = getImageDataPixelNumber({ x: imageXY.x, y: imageXY.y, width });
    const imageDataPixelData = getImageDataPixelData({ pixelNumber, data })
    const pixelOpacity = getPixelOpacity(imageDataPixelData);

    return isGreaterThanZero(pixelOpacity);
};

/**
 * @typedef {Object} getRelativePositionArg
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 *
 * @returns {Position}
 */
function getPositionRelativeToPosition(/** @type {getRelativePositionArg} */ { x, y, left, top }) {
    return {
        x: x - left,
        y: y - top
    };
}

/**
 * @typedef {Object} getImageDataPixelNumberArg
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 *
 * @returns {Number}
 */
function getImageDataPixelNumber(/** @type {getImageDataPixelNumberArg} */ { x, y, width }) {
    return (y - 1) * width + x;
}

/**
 * @typedef {Object} getImageDataPixelDataArg
 * @property {Number} pixelNumber
 * @property {Uint8ClampedArray} data - ImageData
 *
 * @returns {Array<Number>} Array representing [r, g, b, a] of desired pixel
 */
function getImageDataPixelData(/** @type {getImageDataPixelDataArg} */ { pixelNumber, data }) {
    const start = pixelNumber * 4 - 4;

    return data.slice(start, start + 4);
}

/**
 * @param {Array<Number>} pixelData
 *
 * @returns {Number} The opacity value of the pixel
 */
function getPixelOpacity(pixelData) {
    return pixelData[3];
}

function isGreaterThanZero(number) {
    return number > 0;
}
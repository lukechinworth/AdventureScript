/**
 * @typedef {Object} getEventPositionOnCanvasArgs
 * @property {Event} e 
 * @property {HTMLElement} canvas
 * 
 * @typedef {Object} Position
 * @property {number} x 
 * @property {number} y
 * 
 * @returns {Position}
 */
export const getEventPositionOnCanvas = (/** @type {getEventPositionOnCanvasArgs} */ { e, canvas }) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseX = e.clientX - rect.left - root.scrollLeft;
    const mouseY = e.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
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
 * @typedef {Object} PointIsInRectArgs
 * @property {Number} x 
 * @property {Number} y
 * @property {Number} left
 * @property {Number} top
 * @property {Number} width
 * @property {Number} height
 * 
 * @returns {Boolean}
 */
export const pointIsInRect = (/** @type {PointIsInRectArgs} */ { x, y, left, top, width, height }) => x > left
    && x < left + width
    && y > top
    && y < top + height;

/**
 * @typedef {Object} PointIsInImageContentArgs
 * @property {Number} x 
 * @property {Number} y
 * @property {Number} left
 * @property {Number} top
 * @property {Number} width
 * @property {Number} height
 * @property {Array<Number>} data - One dimensional array of image pixels, e.g. [r1, g1, b1, a1, r2, g2, ..., a9]
 * 
 * @returns {Boolean} Opacity is greater than 0
 */
export const pointIsInImageContent = (/** @type {PointIsInImageContentArgs} */ { x, y, left, top, width, data }) => {
    const imageX = x - left;
    const imageY = y - top;
    const pixelNumber = (imageY - 1) * width + imageX;
    const imageDataIndex = pixelNumber * 4 - 1;
    const pixelOpacity = data[imageDataIndex];

    return pixelOpacity > 0;
};
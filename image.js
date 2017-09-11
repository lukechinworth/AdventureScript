export { 
    getImage,
    getImageData,
    pointIsInImage,
    pointIsInImageContent
};

function getImage(uri) {
    const img = new Image();

    return new Promise((resolve, reject) => {
        img.onload = () => {
            resolve(img);
        };
        
        img.onerror = e => {
            reject(e);
        };

        img.src = uri;
    })
}

function getImageData(img) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    // draw the image on the temporary canvas
    context.drawImage(img, 0, 0);
    
    // pull the entire image into an array of pixel data
    return context.getImageData(0, 0, img.width, img.height);
}

// 100 is the image top left position
function pointIsInImage(x, y, image) {
    return x > 100
        && x < 100 + image.width
        && y > 100
        && y < 100 + image.height;
}

function pointIsInImageContent(x, y, imageData) {
    const imageX = x - 100;
    const imageY = y - 100;
    const pixelNumber = (imageY - 1) * imageData.width + imageX;
    const imageDataIndex = pixelNumber * 4 - 1;
    const pixelAlphaChannel = imageData.data[imageDataIndex]

    return pixelAlphaChannel > 0
}
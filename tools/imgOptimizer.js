const imagemin = require('imagemin');

// lossless
// const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

// lossy
const imageminMozjpeg = require('imagemin-mozjpeg');
// const imageminOptipng = require('imagemin-optipng');

async function minimize(buffer, callback) {
  if (buffer !== undefined && buffer !== null) {
    // Compress image in request
    const miniImg = await imagemin.buffer(buffer, {
      plugins: [
        imageminMozjpeg({ quality: process.env.JPEG_QUALITY }),
        imageminPngquant({ quality: process.env.PNG_QUALITY }),
      ],
    });
    callback(miniImg);
  } else {
    callback(0);
  }
}

module.exports = {
  minimize,
};

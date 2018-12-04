const imagemin = require('imagemin');

// lossless
// const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

// lossy
const imageminMozjpeg = require('imagemin-mozjpeg');
// const imageminOptipng = require('imagemin-optipng');

// 0 (worst) - 100 (best)
const jpegQuality = 70;

// 0 (worst) - 100 (best)
const pngQuality = '30-60';

async function minimize(buffer, callback) {
  if (buffer !== undefined && buffer !== null) {
    // Compress image in request
    const miniImg = await imagemin.buffer(buffer, {
      plugins: [
        imageminMozjpeg({ quality: jpegQuality }),
        imageminPngquant({ quality: pngQuality }),
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

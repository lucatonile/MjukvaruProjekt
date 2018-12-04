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

async function minimize(req, res, next) {
  if (req.files !== undefined && req.files !== null) {
    // Compress image in request
    const miniImg = await imagemin.buffer(req.files.image.data, {
      plugins: [
        imageminMozjpeg({ quality: jpegQuality }),
        imageminPngquant({ quality: pngQuality }),
      ],
    });

    // Change image in request to compressed version
    req.files.image.data = miniImg;
    console.log("compressed");
    next();
  } else {
    next();
  }
}

module.exports = {
  minimize,
};

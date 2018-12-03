const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

async function minimize(data) {
  const files = await imagemin.buffer(data, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({ quality: '65-80' }),
    ],
  });

  return files;
  //= > [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
}

module.exports = {
  minimize,
};

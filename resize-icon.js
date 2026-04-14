const sharp = require('sharp');

const src = 'assets/icon_original.png';

sharp(src).metadata().then(meta => {
  const size = Math.min(meta.width, meta.height);
  const left = Math.floor((meta.width - size) / 2);
  const top = Math.floor((meta.height - size) / 2);

  const cropped = sharp(src).extract({left, top, width:size, height:size});

  Promise.all([
    cropped.clone().resize(1024,1024).toFile('assets/icon.png'),
    cropped.clone().resize(1024,1024).toFile('assets/adaptive-icon.png'),
    cropped.clone().resize(512,512).toFile('assets/icon-512.png'),
    cropped.clone().resize(48,48).toFile('assets/favicon.png'),
  ]).then(() => console.log('모든 아이콘 교체 완료!'))
});

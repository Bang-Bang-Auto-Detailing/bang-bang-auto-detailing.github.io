// crop.js <image> <y0> <y1> <out> — crops a horizontal band from a screenshot
const fs = require('fs');
const { PNG } = require('pngjs');
const [, , file, y0s, y1s, out] = process.argv;
const y0 = +y0s, y1 = +y1s;
const img = PNG.sync.read(fs.readFileSync(file));
const h = Math.min(y1, img.height) - y0;
const crop = new PNG({ width: img.width, height: h });
PNG.bitblt(img, crop, 0, y0, img.width, h, 0, 0);
fs.writeFileSync(out, PNG.sync.write(crop));
console.log(out, img.width + 'x' + h);

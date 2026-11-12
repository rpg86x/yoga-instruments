// Tekent het logo van Yoga-instrumenten en schrijft icon.ico (16-256 px) en logo.png.
// Geen afhankelijkheden: eigen rasterizer met 4x4 supersampling en PNG-codering via zlib.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

// Ontwerp in eenheden 0..1: donkergroene ronde tegel met een bronzen gong aan een gouden balk.
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const inEll = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

function sample(x, y) {
  if (Math.hypot(x - 0.5, y - 0.5) > 0.49) return null;
  let c = mix([0.1, 0.21, 0.18], [0.04, 0.08, 0.07], Math.hypot(x - 0.5, y - 0.4) * 1.6);
  const gold = [0.89, 0.71, 0.42], dark = [0.17, 0.1, 0.05];
  // Balk en koorden
  if (y > 0.16 && y < 0.205 && x > 0.2 && x < 0.8) c = gold;
  if (y >= 0.205 && y < 0.36 && (Math.abs(x - 0.39) < 0.009 || Math.abs(x - 0.61) < 0.009)) c = [0.79, 0.7, 0.54];
  // Gong: bronzen schijf met donkere rand en donker hart
  const d = Math.hypot(x - 0.5, y - 0.58);
  if (d < 0.28) {
    c = mix([0.97, 0.86, 0.6], [0.45, 0.28, 0.11], Math.min(1, Math.hypot(x - 0.42, y - 0.49) / 0.42));
    if (Math.abs(d - 0.18) < 0.006) c = mix(c, dark, 0.45);
    if (d > 0.25 || d < 0.095) c = dark;
  }
  return [...c, 1];
}

function render(size) {
  const ss = 4, px = Buffer.alloc(size * size * 4);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sj = 0; sj < ss; sj++) {
        for (let si = 0; si < ss; si++) {
          const s = sample((i + (si + 0.5) / ss) / size, (j + (sj + 0.5) / ss) / size);
          if (!s) continue;
          r += s[0] * s[3]; g += s[1] * s[3]; b += s[2] * s[3]; a += s[3];
        }
      }
      const o = (j * size + i) * 4, n = ss * ss;
      px[o] = a ? Math.round((r / a) * 255) : 0;
      px[o + 1] = a ? Math.round((g / a) * 255) : 0;
      px[o + 2] = a ? Math.round((b / a) * 255) : 0;
      px[o + 3] = Math.round((a / n) * 255);
    }
  }
  return px;
}

function png(size, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8 bit, RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ICO-bestand met ingebedde PNG's (ondersteund sinds Windows Vista)
function ico(images) {
  const head = Buffer.alloc(6 + images.length * 16);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    head[e] = size >= 256 ? 0 : size; head[e + 1] = size >= 256 ? 0 : size;
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map(x => x.data)]);
}

const images = [256, 64, 48, 32, 24, 16].map(size => ({ size, data: png(size, render(size)) }));
fs.writeFileSync(path.join(__dirname, 'icon.ico'), ico(images));
fs.writeFileSync(path.join(__dirname, 'logo.png'), images[0].data);
console.log('icon.ico en logo.png gemaakt');

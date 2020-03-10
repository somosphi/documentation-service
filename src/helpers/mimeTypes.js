const { extname } = require('path');
const NodeCache = require('node-cache');

const defualts = {
  'application/x-yaml': { extensions: ['yaml', 'yml'] },
  'application/json': { extensions: ['json'] },
  'application/pdf': { extensions: ['pdf'] },

  'image/svg+xml': { extensions: ['svg'] },
  'image/gig': { extensions: ['gif'] },
  'image/jpeg': { extensions: ['jpg', 'jpeg', 'jpe'] },
  'image/png': { extensions: ['png'] },

  'audio/midi': { extensions: ['midi'] },
  'audio/mpeg': { extensions: ['mpeg'] },
  'audio/webm': { extensions: ['webm'] },
  'audio/ogg': { extensions: ['ogg'] },
  'audio/wav': { extensions: ['wav'] },

  'video/webm': { extensions: ['webm'] },
  'video/mp4': { extensions: ['mp4'] },
};

exports.defualts = defualts;

const cache = new NodeCache();
const keys = Object.keys(defualts);
const size = keys.length;

const getMimeByExt = (filename) => {
  const ext = extname(filename)
    .replace('.', '')
    .toLowerCase();

  if (ext === '') {
    return 'application/octet-stream';
  }

  const mime = cache.get(ext);
  if (mime) {
    return mime;
  }

  for (let index = 0; index < size; index += 1) {
    const key = keys[index];

    if (defualts[key].extensions && defualts[key].extensions.includes(ext)) {
      cache.set(ext, key);
      return key;
    }
  }

  cache.set(ext, 'application/octet-stream');
  return 'application/octet-stream';
};

exports.getMimeByExt = getMimeByExt;

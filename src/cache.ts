import fs from 'fs';

import config from './config';


const makePath = (filename: string) => `${config.CACHE_DIR}/${filename}`;


let cache: string[] = [];

// Create our cache directory if it doens't exist.
try {
  fs.accessSync(config.CACHE_DIR);
  cache = fs.readdirSync(config.CACHE_DIR)
    .map((filename: string) => {
      const stats = fs.statSync(makePath(filename));
      return {
        filename,
        stats,
      };
    })
    .sort((a, b) => {
      if (a.stats.atimeMs < b.stats.atimeMs) {
        return -1;
      }
      if (a.stats.atimeMs > b.stats.atimeMs) {
        return 1;
      }
      return 0;
    })
    .map(file => file.filename)
    ;
}
catch (err) {
  fs.mkdirSync(config.CACHE_DIR);
}

const get = async (filename: string): Promise<fs.ReadStream | null> => {
  const path = makePath(filename);
  try {
    await fs.promises.access(path, fs.constants.F_OK);
  }
  catch (err) {
    return null;
  }
  return fs.createReadStream(path);
};

const set = async (filename: string, file: Buffer): Promise<void> => {
  const path = makePath(filename);
  await fs.promises.writeFile(path, file);
  cache.push(filename);
  if (cache.length > config.CACHE_MAX) {
    const old_file = cache.shift();
    if (old_file) {
      await fs.promises.unlink(makePath(old_file));
    }
  }
};

export default {
  get,
  set,
};

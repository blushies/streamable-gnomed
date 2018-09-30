import fs from 'fs';
import fetch from 'node-fetch';

import config from './config';
import debug from './debug';
import { fileExists } from './helpers/fs';


// Create our temp directory if it doens't exist.
try {
  fs.accessSync(config.CACHE_DIR);
}
catch (err) {
  fs.mkdirSync(config.CACHE_DIR);
}

// Gnome 'em.
const gnomify = async (url: string, filename: string): Promise<void> => {
  const path = `${config.CACHE_DIR}/${filename}`;
  const exists = await fileExists(path);
  if (!exists) {
    debug(`fetching ${url}`);
    const res = await fetch(url);
    const dest = fs.createWriteStream(path);
    res.body.pipe(dest);
    // TODO - actually gnomify the video
  }
};

export default gnomify;

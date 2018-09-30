import { Transform } from 'stream';

import gnomify from './gnomify';


const re = new RegExp('src="(\/\/.+\.streamable.com\/video\/mp4\/(.+\.mp4).+)"');

const gnomeTransform  = new Transform({
  // @ts-ignore
  transform(chunk: Buffer, encoding: string, callback: Function): void {
    const chunk_as_string = chunk.toString();
    const src_match = chunk_as_string.match(re);
    if (!src_match) {
      return callback(null, chunk);
    }

    const src = `https:${src_match[1].replace('amp;', '')}`;
    const filename = src_match[2];
    gnomify(src, filename);

    const transformed_buffer = new Buffer(chunk_as_string.replace(re, `src="/${filename}"`));
    callback(null, transformed_buffer);
  },
});

export default gnomeTransform;

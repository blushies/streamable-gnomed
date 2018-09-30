import fs from 'fs';
import express from 'express';
import fetch from 'node-fetch';

import config from './config';
import debug from './debug';
import { fileExists } from './helpers/fs';
import makeAsyncMiddleware from './makeAsyncMiddleware';
import gnomeTransform from './gnomeTransform';


const app = express();
const STREAMABLE_URL = 'https://streamable.com';

app.set('x-powered-by', false);


app.all([
  '/',
  '/login',
  '/signup',
], (req, res) => {
  debug('redirecting', req.url);
  res.redirect(`${STREAMABLE_URL}${req.url}`);
});

// @ts-ignore
app.get(/\/.+\.mp4/, makeAsyncMiddleware(async (req, res) => {
  const filename = req.url;
  const filepath = `${config.CACHE_DIR}${filename}`;
  const exists = await fileExists(filepath);
  if (!exists) {
    debug(`couldn't find gnomed file "${filename}"`);
    // TODO - this will just make the page fail, do something else
    res.status(404);
    res.end();
  }
  debug(`serving gnomed mp4: "${filename}"`);
  const file = fs.createReadStream(filepath);
  file.pipe(res);
}));


app.use(makeAsyncMiddleware(async (req, res, next) => {
  debug('proxying', req.url);
  const proxy_res = await fetch(`${STREAMABLE_URL}${req.url}`);
  if (proxy_res.status !== 200) {
    const text = await proxy_res.text();
    next(text);
  }
  proxy_res.body
    .pipe(gnomeTransform)
    .pipe(res)
    ;
}));

// @ts-ignore
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res
    .status(500)
    .send(typeof err === 'object' ? JSON.stringify(err) : err)
    .end()
    ;
});


app.listen(config.PORT, () => debug(`listening on port ${config.PORT}`));

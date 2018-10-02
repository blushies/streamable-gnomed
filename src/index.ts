require('dotenv').config();

import fs from 'fs';
import path from 'path';
import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

import config from './config';
import debug from './debug';
import cache from './cache';
import makeAsyncMiddleware from './makeAsyncMiddleware';


const app = express();
const STREAMABLE_URL = 'https://streamable.com';
const GNOMIFY_SCRIPT = fs.readFileSync(path.resolve(__dirname, '../gnomify.html'), {
  encoding: 'utf8',
});

const injectScript = (html: string): Buffer => {
  const $ = cheerio.load(html);
  $('#video-player-tag').after(GNOMIFY_SCRIPT);
  return Buffer.from($.html());
};

app.set('x-powered-by', false);


app.all([
  '/',
  '/login',
  '/signup',
  '/favicon.ico',
], (req, res) => {
  debug(req.url, 'redirecting');
  res.redirect(`${STREAMABLE_URL}${req.url}`);
});

app.use(makeAsyncMiddleware(async (req, res) => {
  debug(req.url, 'proxying');
  debugger;
  const filename = req.url.slice(1);
  const file = await cache.get(filename);

  if (file) {
    debug(req.url, 'serving from cache');
    file.pipe(res);
    return;
  }

  debug(req.url, 'not in cache, fetching');
  const streamable_res = await fetch(`${STREAMABLE_URL}${req.url}`);

  if (streamable_res.status !== 200) {
    const text = await streamable_res.text();
    throw text;
  }

  const html = await streamable_res.text();
  const data = injectScript(html);

  cache.set(filename, data);
  debug(req.url, 'sending from source');

  res.set('content-type', 'text/html; charset=utf-8');
  res.send(data);
}));

// @ts-ignore
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  debug(req.url, 'error', err);
  res.redirect(`${STREAMABLE_URL}${req.url}`);
});


app.listen(config.PORT, () => debug(`listening on port ${config.PORT}`));

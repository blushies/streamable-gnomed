import os from 'os';


export default {
  PORT: process.env.port || process.env.PORT || 9001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CACHE_DIR: process.env.CACHE_DIR || `${os.tmpdir()}/gnomes`,
  DEBUG_NAME: 'gnomed',
};

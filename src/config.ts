import os from 'os';


export default {
  PORT: process.env.port || process.env.PORT || 9001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CACHE_DIR: process.env.CACHE_DIR || `${os.tmpdir()}/gnomes`,
  CACHE_MAX: process.env.CACHE_MAX || 300,
  DEBUG_NAME: 'gnomed',
};

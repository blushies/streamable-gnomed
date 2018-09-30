import debug from 'debug';

import config from './config';


const logger = debug(config.DEBUG_NAME);

export default logger;

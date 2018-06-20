import * as pino from 'pino';

const l = pino({
  name: process.env.APP_ID,
  level:'info',// process.env.LOG_LEVEL||'info',
});

export default l;

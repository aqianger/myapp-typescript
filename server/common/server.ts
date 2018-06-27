import * as express from 'express';
import { Application } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as  fs from 'fs';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';
import apiRouter from "../api/controllers/ttsrouter";
const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + "client");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    app.all("*", (req:any, res:any, next:()=> void)=> {
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
      res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Credentials", "true");
      if (req.method === "OPTIONS") {
          res.send(200);
      } else {
          next();
      }
  });
    app.use("/api/v1",apiRouter);
  }
  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }
  private options:any = {
    key: fs.readFileSync("../../Certified/private.pem"),
    cert: fs.readFileSync("../../Certified/file.crt"),
    requestCert: false,
    rejectUnauthorized: false
  };
  
  listen(port: number = 3000): Application {
    const welcome = port => () => l.info(`up and running in ${process.env.NODE_ENV || "development"} @: ${os.hostname() } on port: ${port}}`);
    https.createServer(this.options, app).listen(port, welcome(port));
    return app;
  }
}
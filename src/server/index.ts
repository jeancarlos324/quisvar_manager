import express, { Application, Request, Response, NextFunction } from 'express';

import http from 'http';
import { prismaInit } from '../utils/prisma.server';
import AppError from '../utils/appError';
import globalErrorHandler from '../middlewares/error.middleware';
import path from 'path';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { verifySecretEnv } from '../middlewares/auth.middleware';

dotenv.config();
class Server {
  private app!: Application;
  private httpServer: http.Server;
  private PORT: string = process.env.PORT || '8080';
  private HOST: string = process.env.HOST || 'localhost';
  private rootDir = path.resolve(__dirname, '../..');
  private path: { [key: string]: string } = {
    auth: `/${process.env.ROUTE}/auth/login`,
  };
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.conectionWebSockect();
    this.conectionCron();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use('/uploads', express.static('public'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    this.app.use(verifySecretEnv);
  }
  conectionWebSockect() {}
  conectionCron() {}
  routeNotFound() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.locals.pageNotFound = this.rootDir + '/404_page/index.html';
      return next(
        new AppError(`can't find ${req.originalUrl} on this server`, 404)
      );
    };
  }
  routes() {
    this.app.use(this.path.auth, () => {});
    //------------------------------------------------------------------
    this.app.all('*', this.routeNotFound());
    this.app.use(globalErrorHandler);
  }

  async serverInit() {
    if (!this.PORT && !this.HOST)
      console.log('No se pudo conectar al servidor 😥');
    prismaInit();
    console.log(`Server deployed at 🚀 ==> http://${this.HOST}:${this.PORT}/`);
  }
  listen() {
    this.httpServer.listen(this.PORT, async () => await this.serverInit());
  }
}
export default Server;

import { NextFunction, Request, Response} from "express";
import { CartAPILogger } from '../lib/logger';
import * as jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (!token) {
    CartAPILogger.logger.info(`[service.auth] [auth()] Access Denied`);
    return res.status(401).send('Access Denied');
  }
  try {
    const validToken = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (error) {
      CartAPILogger.logger.error(`[service.auth] [auth()] Invalid Token`);
      return res.status(400).send('Invalid Token');
  }
};

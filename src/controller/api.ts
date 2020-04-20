import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const getApi = (req: Request, res: Response) => {
  return res.status(200).send({ title: 'Product API' });
};

export const getJwtToken = (req: Request, res: Response) => {
  const jwtToken = jwt.sign({api_ver: 'v1.0.0'}, process.env.TOKEN_SECRET);
  res.header('auth-token', jwtToken).send(jwtToken);
};
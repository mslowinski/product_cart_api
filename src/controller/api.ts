import { Request, Response } from 'express';

export let getApi = (req: Request, res: Response) => {
  return res.status(200).send({ title: 'Product API' });
};
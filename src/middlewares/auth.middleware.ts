import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

dotenv.config();
const SECRET = process.env.SECRET;
export const verifySecretEnv = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (SECRET) return next();
    throw new AppError('Palabra secreta indefinida', 400);
  } catch (error) {
    next(error);
  }
};

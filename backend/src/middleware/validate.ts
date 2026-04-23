import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Reqponse, next: NextFunction) => {
    try {
      schema.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

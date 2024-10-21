// types/express.d.ts
import * as express from 'express';
import User from './models/User';
declare global {
  namespace Express {
    interface Request {
      user?: typeof User; 
    }
  }
}
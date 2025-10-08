// types/express.d.ts
import * as express from 'express';
import { UserEntity } from './models/User';
declare global {
  namespace Express {
    interface Request {
      user?: UserEntity; 
    }
  }
}
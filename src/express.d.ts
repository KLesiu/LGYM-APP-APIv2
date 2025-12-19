// express.d.ts
import { UserEntity } from '../src/models/User'; 

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserEntity;
  }
}

export {};
import { JwtPayload } from './jwt-payload';

declare global {
   namespace Express {
      export interface Request {
         user: JwtPayload;
      }
   }
}

export {};

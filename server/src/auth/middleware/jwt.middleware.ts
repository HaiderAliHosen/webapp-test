import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.decode(token);
        req.user = decoded;
      } catch (err) {
        // Token verification failed
      }
    }
    next();
  }
}

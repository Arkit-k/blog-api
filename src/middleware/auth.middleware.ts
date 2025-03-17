import { users } from './../db/schema';
import { Request , Response , NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { config } from "dotenv";

config();


declare global {
      namespace Express {
            interface Request {
                  user?:{
                        userId:number;
                  };
            }
      } 
}

export const authenticate = (req: Request , res:Response, next: NextFunction) =>{
      try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer')) {
                  return res.status(401).json({error: 'Authentication requires'});
            }
            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number};

            req.user = decoded;

            next();
      }  catch (error) {
            return res.status(401).json({error:'invalid or expired token'});
      }
};
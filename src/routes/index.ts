import { Express } from "express";
import authRoutes from './auth.route';
import postRoutes from './post.routes';


export const setupRoutes = ( app: Express) =>{
      app.use('/api/auth', authRoutes);
      app.use('/api/posts' , postRoutes);

      app.get('/health', (req, res) => {
            res.status(200).json({ status: 'OK' });
          });
        };



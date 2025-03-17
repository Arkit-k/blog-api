// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { authService } from '../services/auth.services';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      
      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password and name are required' });
      }
      
      // Register user
      const result = await authService.register(email, password, name);
      
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Login user
      const result = await authService.login(email, password);
      
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export const authController = new AuthController();
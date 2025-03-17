import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import * as schema from '../db/schema'
import { users } from '../db/schema'
import {  eq } from 'drizzle-orm'
import {db} from "../db"
import { config } from '../config'

export class AuthService{
      async register(email: string, password: string, name: string){
            const existingUser = await db.select()
            .from(users)
            .where(eq(users.email,email))
            .limit(1);

            if (existingUser.length > 0) {
                  throw new Error('user already exists')
                  }
            
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const [ newUser ] = await db.insert(users)
            .values({
                  email,
                  passwordHash ,
                  name
            })
            .returning();

            const token = this.generateToken(newUser.id.toString());

            return {
                  user:{
                        id:newUser.id,
                        email: newUser.email,
                        name:newUser.name
                  },
                  token
            };
      }

      async login(email: string , password:string) {
            const foundUsers = await db.select()
            .from(users)
            .where(eq(users.email , email))
            .limit(1)

            if(foundUsers.length === 0) {
                  throw new Error('Invalid email or password');
            }

            const user = foundUsers[0];

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

            if(!isPasswordValid) {
                  throw new Error('Invalid email or password');
            }

            const token = this.generateToken(user.id.toString());

            return {
                  user:{
                        id: user.id,
                        email: user.email,
                        name: user.name
                  },
                  token
            };
      }
            
            private generateToken(userId: string): string {
                  const payload = { id: userId };
                  return jwt.sign(payload, config.JWTSecret, { expiresIn: '1h' });
            }
}

export const authService = new AuthService();



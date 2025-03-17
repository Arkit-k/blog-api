import dotenv from 'dotenv';
dotenv.config();

export const config = {
      port: process.env.PORT || 3000,
      JWTSecret: process.env.JWT_Secret || 'fallback_secret_key',
      jwrExpireIn:'24h'
}
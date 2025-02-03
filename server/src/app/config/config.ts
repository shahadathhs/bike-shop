import dotenv from 'dotenv'

// ** Load Environment Variables **
dotenv.config({ path: '.env' })

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? 5000,
  mongo: {
    url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/test',
  }
}

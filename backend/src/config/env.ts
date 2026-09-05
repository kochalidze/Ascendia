import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.BETTER_AUTH_SECRET) throw new Error('BETTER_AUTH_SECRET is not defined in .env')
if (!process.env.BETTER_AUTH_URL) throw new Error('BETTER_AUTH_URL is not defined in .env')
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined in .env')
if (!process.env.PORT) throw new Error('PORT is not defined in .env')
if (!process.env.BUCKET_NAME) throw new Error('BUCKET_NAME is not defined in .env')
if (!process.env.R2_ACCESS_KEY_ID) throw new Error('R2_ACCESS_KEY_ID is not defined in .env')
if (!process.env.R2_SECRET_ACCESS_KEY) throw new Error('R2_SECRET_ACCESS_KEY is not defined in .env')
if (!process.env.R2_ACCOUNT_ID) throw new Error('R2_ACCOUNT_ID is not defined in .env')

const env = {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
    BUCKET_NAME: process.env.BUCKET_NAME,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID
}

export default env;
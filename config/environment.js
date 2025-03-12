import { config } from "dotenv"

// .env 파일 로드
config()

const environment = {
	local: {
		DB_HOST: process.env.LOCAL_DB_HOST,
		DB_USER: process.env.LOCAL_DB_USER,
		DB_PASSWORD: process.env.LOCAL_DB_PASSWORD,
		DB_NAME: process.env.LOCAL_DB_NAME,
		REDIS_HOST: process.env.LOCAL_REDIS_HOST || localhost,
		REDIS_PORT: process.env.LOCAL_REDIS_PORT || 6379,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
	},
	development: {
		DB_HOST: process.env.DEVELOPMENT_DB_HOST,
		DB_USER: process.env.DEVELOPMENT_DB_USER,
		DB_PASSWORD: process.env.DEVELOPMENT_DB_PASSWORD,
		DB_NAME: process.env.DEVELOPMENT_DB_NAME,
		REDIS_HOST: process.env.DEV_REDIS_HOST,
		REDIS_PORT: process.env.DEV_REDIS_PORT,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
	},
	production: {
		DB_HOST: process.env.PRODUCTION_DB_HOST,
		DB_USER: process.env.PRODUCTION_DB_USER,
		DB_PASSWORD: process.env.PRODUCTION_DB_PASSWORD,
		DB_NAME: process.env.PRODUCTION_DB_NAME,
		REDIS_HOST: process.env.PROD_REDIS_HOST,
		REDIS_PORT: process.env.PROD_REDIS_PORT,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
	},
}

const nodeEnv = process.env.NODE_ENV || "local"
export default environment[nodeEnv]

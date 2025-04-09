import { config } from "dotenv"

// .env 파일 로드
config()

const environment = {
	local: {
		REDIS_HOST: process.env.LOCAL_REDIS_HOST || "localhost",
		REDIS_PORT: process.env.LOCAL_REDIS_PORT || 6379,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
		SENDER_EMAIL: process.env.SENDER_EMAIL,
		SENDER_SECRET: process.env.SENDER_SECRET
	},
	development: {
		REDIS_HOST: process.env.DEV_REDIS_HOST,
		REDIS_PORT: process.env.DEV_REDIS_PORT,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
		SENDER_EMAIL: process.env.SENDER_EMAIL,
		SENDER_SECRET: process.env.SENDER_SECRET
	},
	production: {
		REDIS_HOST: process.env.PROD_REDIS_HOST,
		REDIS_PORT: process.env.PROD_REDIS_PORT,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
		SENDER_EMAIL: process.env.SENDER_EMAIL,
		SENDER_SECRET: process.env.SENDER_SECRET
	},
}

const nodeEnv = process.env.NODE_ENV || "local"
export default environment[nodeEnv]

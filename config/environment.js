import { config } from "dotenv"

// .env 파일 로드
config()

const environment = {
	local: {
		REDIS_HOST: "localhost",
		REDIS_PORT: 6379,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
		SENDER_EMAIL: process.env.SENDER_EMAIL,
		SENDER_SECRET: process.env.SENDER_SECRET
	},
	development: {
		REDIS_HOST: process.env.REDIS_HOST,
		REDIS_PORT: process.env.REDIS_PORT,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
		SENDER_EMAIL: process.env.SENDER_EMAIL,
		SENDER_SECRET: process.env.SENDER_SECRET
	},
	production: {
		REDIS_HOST: process.env.REDIS_HOST,
		REDIS_PORT: process.env.REDIS_PORT,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
		SENDER_EMAIL: process.env.SENDER_EMAIL,
		SENDER_SECRET: process.env.SENDER_SECRET
	},
}

const nodeEnv = process.env.NODE_ENV || "development"
export default environment[nodeEnv]

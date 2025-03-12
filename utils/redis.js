import Redis from "ioredis"
import environment from "../config/environment.js"

const redis = new Redis({
	host: environment.REDIS_HOST,
	port: environment.REDIS_PORT,
})

export default redis

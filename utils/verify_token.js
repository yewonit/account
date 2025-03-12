import pkg from "jsonwebtoken"
import environment from "../config/environment.js"
const { verify } = pkg

const JWT_SECRET_KEY = environment.JWT_SECRET_KEY

const verifyToken = (token, callback) => {
	verify(token, JWT_SECRET_KEY, callback)
}

export default verifyToken

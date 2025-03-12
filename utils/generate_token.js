import pkg from "jsonwebtoken"
import environment from "../config/environment.js"
const { sign } = pkg

const ACCESS_TOKEN_EXPIRE = 60 * 60 * 3
const REFRESH_TOKEN_EXPIRE = 60 * 60 * 24 * 7
const JWT_SECRET_KEY = environment.JWT_SECRET_KEY

// JWT 토큰 생성 함수
const generateTokens = (email, name) => {
	// AccessToken 생성 (3시간 만료)
	const accessToken = sign({ email, name }, JWT_SECRET_KEY, {
		expiresIn: "3h",
	})

	// RefreshToken 생성 (1주일 만료)
	const refreshToken = sign({ email, name }, JWT_SECRET_KEY, {
		expiresIn: "7d",
	})

	return {
		accessToken,
		accessTokenExpiresAt: ACCESS_TOKEN_EXPIRE,
		refreshToken,
		refreshTokenExpiresAt: REFRESH_TOKEN_EXPIRE,
	}
}

export default generateTokens

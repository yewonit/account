import { Router } from "express"
import User from "../models/user.js"
import generateTokens from "../utils/generate_token.js"
import redis from "../utils/redis.js"

const router = Router()
const env = process.env.NODE_ENV

// /token 엔드포인트: 이메일과 이름을 받아 JWT 토큰 생성 후 반환
router.post("/token", async (req, res) => {
	const { email, name, password } = req.body

	if (!email || !name || !password) {
		return res
			.status(400)
			.json({ error: "Email and name and password are required" })
	}

	console.log(password)
	const encodedPassword = Buffer.from(password).toString("base64")

	console.log(encodedPassword)
	const user = await User.findOne({
		where: {
			name: name,
			email: email,
			is_deleted: "N",
		},
	})

	if (user.password !== encodedPassword) {
		return res.status(401).json({ error: "Invalid email or password" })
	}

	// JWT 토큰 생성
	const {
		accessToken,
		refreshToken,
		accessTokenExpiresAt,
		refreshTokenExpiresAt,
	} = generateTokens(email, name)

	try {
		// Redis에 토큰 저장 (TTL 설정)
		await redis.setex(`${env}_accessToken_${email}`, 60 * 60 * 3, accessToken) // 3시간 TTL
		await redis.setex(
			`${env}_refreshToken_${email}`,
			60 * 60 * 24 * 7,
			refreshToken
		) // 1주일 TTL

		// 응답으로 토큰 반환
		res.json({
			accessToken,
			accessTokenExpiresAt,
			refreshToken,
			refreshTokenExpiresAt,
		})
	} catch (err) {
		console.error("Failed to save tokens in Redis:", err)
		res.status(500).json({ error: "Internal server error" })
	}
})

export { router as TokenRouter }

import { Router } from "express"
import generateTokens from "../utils/generate_token.js"
import redis from "../utils/redis.js"

const router = Router()

// /token 엔드포인트: 이메일과 이름을 받아 JWT 토큰 생성 후 반환
router.post("/token", async (req, res) => {
	const { email, name } = req.body

	if (!email || !name) {
		return res
			.status(400)
			.json({ error: `Email and name are required  email: ${email}, name: ${name}` })
	}

	try {
		// JWT 토큰 생성
		const {
			accessToken,
			refreshToken,
			accessTokenExpiresAt,
			refreshTokenExpiresAt,
		} = generateTokens(email, name)

		// Redis에 토큰 저장 (TTL 설정)
		await redis.setex(accessToken, accessTokenExpiresAt, true) // 3시간 TTL
		await redis.setex(refreshToken, refreshTokenExpiresAt, true) // 1주일 TTL

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

export default router

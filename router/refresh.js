import { Router } from "express"
import generateTokens from "../utils/generate_token.js"
import redis from "../utils/redis.js"
import verifyToken from "../utils/verify_token.js"

const router = Router()

// /refresh 엔드포인트: refreshToken을 받아 새로운 accessToken과 refreshToken 갱신
router.post("/refresh", async (req, res) => {
	const { refreshToken } = req.body

	if (!refreshToken) {
		return res.status(400).json({ error: "Refresh token is required" })
	}

	await redis.get(refreshToken, (err, result) => {
		if (err) {
			throw new Error(err)
		}
		else if (!result) {
			return res.status(401).json({ error: "Expired" })
		}
	})

	try {
		// refreshToken 검증
		verifyToken(refreshToken, async (err, decoded) => {
			if (err) {
				return res
					.status(401)
					.json({ error: "Invalid refresh token" })
			}

			const { email, name } = decoded

			// 새로운 JWT 토큰 생성
			const {
				accessToken,
				refreshToken: newRefreshToken,
				accessTokenExpiresAt,
				refreshTokenExpiresAt,
			} = generateTokens(email, name)

			// Redis에 새로운 토큰 저장
			await redis.setex(
				accessToken,
				accessTokenExpiresAt,
				true
			) // 3시간 TTL
			await redis.setex(
				newRefreshToken,
				refreshTokenExpiresAt,
				true
			) // 1주일 TTL

			// 새로운 토큰 반환
			res.json({
				accessToken,
				refreshToken: newRefreshToken,
				accessTokenExpiresAt,
				refreshTokenExpiresAt,
			})
		})
	} catch (err) {
		console.error("Failed to refresh tokens:", err)
		res.status(500).json({ error: "Internal server error" })
	}
})

export default router

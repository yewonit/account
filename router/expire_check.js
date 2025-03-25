import { Router } from "express";
import redis from "../utils/redis.js";
import verifyToken from "../utils/verify_token.js";

const router = Router()

router.post("/verify", async (req, res) => {
    const { accessToken } = req.body

    await redis.get(accessToken, (err, result) => {
        if (err) {
			throw new Error(err)
		}
		else if (!result) {
			return res.status(401).json({ error: "Expired" })
		}
    })

    try {
        verifyToken(accessToken, async (err, decoded) => {
            if (err) {
                return res
                    .status(400)
                    .json({ error: "Invalid access token" })
            }
    
            const { email, name } = decoded
    
            return {
                email: email,
                name: name
            }
        })
    } catch (err) {
		console.error("Failed to verify access tokens:", err)
		res.status(500).json({ error: "Internal server error" })
	}
})

export default router

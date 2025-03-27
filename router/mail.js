import { Router } from "express"
import mailsender from "../utils/mailsender.js"

const router = Router()

router.post("/code", async (req, res, next) => {
	const receiver = req.body.email
	if (!receiver) return res.status(400).json({ error: "Email not exists."})
	try {
		await mailsender.sendVerificationEmail(receiver)
		res.status(200).json({ result: true })
	} catch (error) {
		next(error)
	}
})

router.post("/verify", async (req, res, next) => {
	const { email, code } = req.body
	if (!email || !code) return res.status(400).json({ error: "Email or Code not exists."})
	try {
		const result = await mailsender.verifyEmailCode(email, code)
		res.status(200).json({ result })
	} catch (error) {
		next(error)
	}
})

export default router

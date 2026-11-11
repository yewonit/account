import { Router } from "express"
import mailsender from "../utils/mailsender.js"

const router = Router()

// 단일 일반 이메일 주소만 허용 — 주소 파서 혼동(따옴표·주석·그룹·다중 수신자)을 이용해
// 인증 코드를 다른 도메인으로 보내게 만드는 nodemailer 계열 취약점 방어
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/
const isValidEmail = (value) =>
	typeof value === "string" && value.length <= 254 && EMAIL_PATTERN.test(value)

router.post("/code", async (req, res, next) => {
	const receiver = req.body.email
	if (!receiver) return res.status(400).json({ error: "Email not exists."})
	if (!isValidEmail(receiver)) return res.status(400).json({ error: "Invalid email." })
	try {
		await mailsender.sendVerificationEmail(receiver)
		res.status(200).json(true)
	} catch (error) {
		next(error)
	}
})

router.post("/verify", async (req, res, next) => {
	const { email, code } = req.body
	if (!email || !code) return res.status(400).json({ error: "Email or Code not exists."})
	if (typeof email !== "string" || typeof code !== "string")
		return res.status(400).json({ error: "Invalid email or code." })
	try {
		const result = await mailsender.verifyEmailCode(email, code)
		res.status(200).json(result)
	} catch (error) {
		next(error)
	}
})

export default router

import { Router } from "express";
import mailsender from "../utils/mailsender.js"

const router = Router()

router.post("/code", async (req, res) => {
    const receiver = req.body.email
    await mailsender.sendVerificationEmail(receiver)
    res.status(204)
})

router.post("/verify", async (req, res) => {
    const { email, code } = req.body
    const result = await mailsender.verifyEmailCode(email, code)
    if (result)
        res.status(200).json(true)
    else
        res.status(400).json(false)
})

export default router

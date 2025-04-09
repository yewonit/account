import { randomBytes } from "crypto"
import { createTransport } from "nodemailer"
import environment from "../config/environment.js"
import redis from "./redis.js"

const SENDER = environment.SENDER_EMAIL
const SENDER_SECRET = environment.SENDER_SECRET

const transporter = createTransport({
	service: "Gmail",
	auth: {
		user: SENDER,
		pass: SENDER_SECRET,
	},
})

const generateVerificationCode = () => {
	return randomBytes(3).toString("hex")
}

const sendVerificationEmail = async (receiver) => {
	const verificationCode = generateVerificationCode()

	const mailOptions = {
		from: SENDER, // 발신자
		to: receiver, // 수신자
		subject: "[두기고] 이메일 인증 코드",
		html: mailTemplate("두기고 인증코드", "다음은 이메일 인증을 위한 코드입니다", verificationCode),
		text: `안녕하세요! 인증 코드는 다음과 같습니다: ${verificationCode}`,
	}

	try {
		await transporter.sendMail(mailOptions)
		await redis.setex(
			`email_verification_${receiver}`,
			60 * 30,
			verificationCode
		)
		return true
	} catch (error) {
		throw new Error("이메일 전송 중 오류가 발생했습니다.")
	}
}

const verifyEmailCode = async (email, code) => {
	const result = await redis.get(`email_verification_${email}`)

  if (result === code) {
    await redis.del([`email_verification_${email}`])
    return true
  } else {
    return false
  }
}

const sendResetPasswordEmail = async (receiver, newPassword) => {
  const mailOptions = {
    from: SENDER,
    to: receiver,
    subject: "[두기고] 비밀번호 재설정",
    html: mailTemplate("비밀번호 재설정", "재설정된 비밀번호입니다", newPassword),
    text: `안녕하세요! 재설정된 비밀번호는 다음과 같습니다: ${newPassword}`,
  }

  try {
		await transporter.sendMail(mailOptions)
		return true
	} catch (error) {
		throw new Error("이메일 전송 중 오류가 발생했습니다.")
	}
}

const mailTemplate = (subject, description, code) => {
	return `
    <table
  style="
    font-family: Arial, sans-serif;
    width: 100%;
    max-width: 320px;
    border-radius: 10px;
    background-color: #e0f7f5;
    margin: 0 auto;
    overflow: hidden;
    border-collapse: collapse;
  "
>
  <!-- Mac 스타일 버튼 -->
  <tr>
    <td style="padding: 10px; position: relative;">
      <table style="margin: 0; padding: 0; display: inline-table;">
        <tr>
          <td
            style="
              width: 12px;
              height: 12px;
              background-color: #ff5f56;
              border-radius: 50%;
            "
          ></td>
          <td
            style="
              width: 12px;
              height: 12px;
              background-color: #ffbd2e;
              border-radius: 50%;
              margin-left: 5px;
            "
          ></td>
          <td
            style="
              width: 12px;
              height: 12px;
              background-color: #27c93f;
              border-radius: 50%;
              margin-left: 5px;
            "
          ></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 제목 섹션 -->
  <tr>
    <td
      style="
        background-color: #4caf50;
        color: white;
        text-align: center;
        padding: 15px;
        font-size: 18px;
        font-weight: bold;
      "
    >
      ${subject}
    </td>
  </tr>

  <!-- 본문 섹션 -->
  <tr>
    <td
      style="
        background-color: white;
        text-align: center;
        padding: 20px;
        color: black;
        font-size: 14px;
      "
    >
      <p style="margin: 0 0 10px;">${description}</p>
      <p
        style="
          font-size: 24px;
          font-weight: bold;
          color: #4caf50;
          margin: 0;
        "
      >
        ${code}
      </p>
    </td>
  </tr>
</table>
    `
}

export default { sendVerificationEmail, verifyEmailCode, sendResetPasswordEmail }

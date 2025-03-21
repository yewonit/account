import { createTransport } from 'nodemailer';
import { randomBytes } from 'crypto';
import environment from '../config/environment.js';
import redis from './redis.js';

const SENDER = environment.SENDER_EMAIL
const SENDER_SECRET = environment.SENDER_SECRET


const transporter = createTransport({
  service: 'Gmail',
  auth: {
    user: SENDER,
    pass: SENDER_SECRET,
  },
});

const generateVerificationCode = () => {
  return randomBytes(3).toString('hex');
}

const sendVerificationEmail = async (receiver) => {
  const verificationCode = generateVerificationCode();

  const mailOptions = {
    from: SENDER, // 발신자
    to: receiver, // 수신자
    subject: '이메일 인증 코드',
    html: mailTemplate(verificationCode),
    text: `안녕하세요! 인증 코드는 다음과 같습니다: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await redis.setex(`email_verification_${verificationCode}`, 60 * 30, receiver)
    return true
  } catch (error) {
    throw new Error('이메일 전송 중 오류가 발생했습니다.');
  }
}

const verifyEmailCode = async (email, code) => {
    await redis.get(`email_verification_${code}`, (err, result) => {
        if (result === email) {
            redis.del([`email_verification_${code}`])
            return true
        } else if (result !== email) {
            return false
        } else {
            throw new Error(`Email verification error : ${err}`)
        }
    })
}

const mailTemplate = (code) => {
    return `
    <div style="font-family: Arial, sans-serif; width: 320px; height: 220px; border-radius: 10px; background-color: #E0F7F5; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden; position: relative;">

    <!-- Mac 스타일 버튼 -->
    <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 5px;">
      <div style="width: 12px; height: 12px; background-color: #FF5F56; border-radius: 50%;"></div>
      <div style="width: 12px; height: 12px; background-color: #FFBD2E; border-radius: 50%;"></div>
      <div style="width: 12px; height: 12px; background-color: #27C93F; border-radius: 50%;"></div>
    </div>
  
    <!-- 제목 섹션 -->
    <div style="background-color: #4CAF50; color: white; display: flex; align-items: center; justify-content: center; height: 60px;">
      <h2 style="margin: 0; font-size: 18px;">두기고 인증코드</h2>
    </div>
    
    <!-- 본문 섹션 -->
    <div style="padding: 10px 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; flex-grow: 1; background-color: white;">
      <p style="margin: 0 0 10px; color: black; font-size: 14px;">다음은 이메일 인증을 위한 코드입니다</p>
      <p style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 0;">${code}</p>
    </div>
  </div>
    `
}

export default { sendVerificationEmail, verifyEmailCode };

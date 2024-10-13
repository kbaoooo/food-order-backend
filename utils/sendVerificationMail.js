import { createMailTransporter } from './createMailTransporter.js';

export const sendVerificationMail = async (user) => {
    const transporter = createMailTransporter();

    const mailOptions = {
        from: '"Tomato" <TomatoRestaurant@gmail.com>',
        to: user.email,
        subject: "Please verify your email",
        html: `<h1>Hi ${user.name},</h1>
        <p>Cảm ơn bạn đã ghé thăm nhà hàng của <span style='color: tomato; font-weight: bold;'>Tomato</span>. Hãy nhấn vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
        <a href="http://localhost:5173/verify-email?emailToken=${user.email_token}">Xác minh tài khoản</a>`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return { success: false, error };
        } else {
            console.log("Email sent: " + info.response);
            return { success: true };
        }
    });
}
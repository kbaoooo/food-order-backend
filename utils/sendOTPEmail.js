import { createMailTransporter } from "./createMailTransporter.js";

export const sendOTPEmail = async (user, otp) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Tomato" <TomatoRestaurant@gmail.com>',
    to: user.email,
    subject: "Thay đổi mật khẩu",
    html: `<h3 style='color: tomato;'>Chào bạn ${user.username},</h3>
        <p>
            Chúng tôi đã nhận được yêu cầu thay đổi mật khẩu của bạn, mã OTP sẽ hết hạn trong vòng 60 giây. Đây là mã OTP
            của bạn: <span style='font-weight: 600; color: tomato;'>${otp}</span>
        </p>
        <p>
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
        </p>`,
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
};

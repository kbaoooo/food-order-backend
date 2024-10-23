import { createMailTransporter } from "./createMailTransporter.js";

export const sendPaymentStatus = async (user) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Tomato" <TomatoRestaurant@gmail.com>',
    to: user.email,
    subject: "Cập nhật trạng thái đơn hàng - Thanh toán thành công",
    html: `<h3 style='color: tomato;'>Chào bạn ${user.username},</h3>
        <p>
            Cảm ơn bạn đã tin tưởng và đặt hàng tại <span style='color: tomato; font-weight: bold;'>Tomato</span>. Đơn hàng của bạn đã được thanh toán thành công.
        </p>
        <p>
            Tomato luôn mong muốn mang đến cho bạn những trải nghiệm tuyệt vời nhất. Mong bạn có thể để lại đánh giá của mình về dịch vụ của chúng tôi để chúng tôi có thể phục vụ bạn tốt hơn.
        </p>
        <p style='text-align: right; font-weight: 600;'>Trân trọng,</p>`,
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

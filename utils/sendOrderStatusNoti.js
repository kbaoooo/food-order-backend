import { createMailTransporter } from "./createMailTransporter.js";

export const sendOrderStatusNoti = async (user, status, order_id) => {
  const transporter = createMailTransporter();

  let mailOptions = {};

  const mailForPending = {
    from: '"Tomato" <TomatoRestaurant@gmail.com>',
    to: user.email,
    subject: "Cập nhật trạng thái đơn hàng - Đặt hàng thành công",
    html: `<h3 style='color: tomato;'>Chào bạn ${user.username},</h3>
        <p>
            Cảm ơn bạn đã tin tưởng và đặt hàng tại <span style='color: tomato; font-weight: bold;'>Tomato</span>. Đơn hàng của bạn đã được đặt thành công.
        </p>
        <p>
            Xin hãy vui lòng đợi nhà hàng xác nhận và trạng thái đơn hàng sẽ cập nhật cho bạn ngay khi quá trình xác nhận hoàn tất. Vui lòng đợi trong ít phút nhé!

            Nếu có bất kỳ thắc mắc nào, bạn có thể liên hệ với chúng tôi qua email hoặc số hotline để được hỗ trợ.

            Một lần nữa, xin chân thành cảm ơn và rất mong được phục vụ bạn trong thời gian sớm nhất.
        </p>
        <p style='text-align: right; font-weight: 600;'>Trân trọng,</p>
        `,
  };

  const mailForConfirmed = {
    from: '"Tomato" <TomatoRestaurant@gmail.com>',
    to: user.email,
    subject: "Cập nhật trạng thái đơn hàng - Đơn hàng đã được xác nhận",
    html: `<h3 style='color: tomato;'>Chào bạn ${user.username},</h3>
        <p>
            Cảm ơn bạn đã tin tưởng và đặt hàng tại <span style='color: tomato; font-weight: bold;'>Tomato</span>. Đơn hàng của bạn đã được xác nhận thành công.
        </p>
        <p>
            Đơn hàng của bạn đang được chuẩn bị và sẽ sớm được giao đến bạn. Vui lòng chờ trong ít phút nhé!

            Nếu có bất kỳ thắc mắc nào, bạn có thể liên hệ với chúng tôi qua email hoặc số hotline để được hỗ trợ.

            Một lần nữa, xin chân thành cảm ơn và rất mong được phục vụ bạn trong thời gian sớm nhất.
        </p>
        <p style='text-align: right; font-weight: 600;'>Trân trọng,</p>
        `,
  };

  const mailForPreparing = {
    from: '"Tomato" <TomatoRestaurant@gmail.com>',
    to: user.email,
    subject: "Cập nhật trạng thái đơn hàng - Đơn hàng đang được chuẩn bị",
    html: `<h3 style='color: tomato;'>Chào bạn ${user.username},</h3>
        <p>
            Cảm ơn bạn đã tin tưởng và đặt hàng tại <span style='color: tomato; font-weight: bold;'>Tomato</span>. Nhà hàng đang làm món ăn và sẽ giao đến bạn khi hoàn thành.
        </p>
        <p>
            Hãy chờ trong ít phút nhé! Đơn hàng sẽ đến tay bạn trong thời gian sớm nhất.

            Nếu có bất kỳ thắc mắc nào, bạn có thể liên hệ với chúng tôi qua email hoặc số hotline để được hỗ trợ.

            Một lần nữa, xin chân thành cảm ơn và rất mong được phục vụ bạn trong thời gian sớm nhất.
        </p>
        <p style='text-align: right; font-weight: 600;'>Trân trọng,</p>
        `,
  };

  const mailForDelivering = {
    from: '"Tomato" <TomatoRestaurant@gmail.com>',
    to: user.email,
    subject: "Cập nhật trạng thái đơn hàng - Đơn hàng đang được giao",
    html: `<h3 style='color: tomato;'>Chào bạn ${user.username},</h3>
        <p>
            Cảm ơn bạn đã tin tưởng và đặt hàng tại <span style='color: tomato; font-weight: bold;'>Tomato</span>. Đơn hàng đang được giao đến bạn.
        </p>
        <p>
            Tùy vào khoảng cách và điều kiện giao hàng, món ăn sẽ được giao trong vòng 25 - 45 phút. Hãy vui lòng chú ý điện thoại để shipper có thể liên lạc với bạn khi đến nơi!

            Nếu có bất kỳ thắc mắc nào, bạn có thể liên hệ với chúng tôi qua email hoặc số hotline để được hỗ trợ.

            Một lần nữa, xin chân thành cảm ơn và rất mong được phục vụ bạn trong thời gian sớm nhất.
        </p>
        <p style='text-align: right; font-weight: 600;'>Trân trọng,</p>
        `,
  };

  const mailForCompleted = {
    from: '"Tomato" <TomatoRestaurant@gmail.com>',
    to: user.email,
    subject: "Cập nhật trạng thái đơn hàng - Đơn hàng đã được giao",
    html: `<h3 style='color: tomato;'>Chào bạn ${user.username},</h3>
        <p>
            Cảm ơn bạn đã tin tưởng và đặt hàng tại <span style='color: tomato; font-weight: bold;'>Tomato</span>. Đơn hàng của bạn đã được giao thành công.
        </p>
        <p>
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Mong rằng bạn sẽ tiếp tục ủng hộ và đánh giá tích cực cho chất lượng dịch vụ của nhà hàng Tomato.

            Hãy kiểm tra kỹ đơn hàng của bạn. Nếu có bất kỳ vấn đề gì, vui lòng liên hệ với chúng tôi qua email hoặc số hotline để được hỗ trợ.

            Một lần nữa, xin chân thành cảm ơn và rất mong được phục vụ bạn trong thời gian sớm nhất.
        </p>
        <p style='text-align: right; font-weight: 600;'>Trân trọng,</p>
        `,
  };

  const mailForCancelled = {
    from: '"Tomato" <TomatoRestaurant@gmail.com>',
    to: user.email,
    subject: "Cập nhật trạng thái đơn hàng - Đơn hàng đã bị hủy",
    html: `<h3 style='color: tomato;'>Chào bạn ${user.username},</h3>
        <p>
            Rất tiếc phải thông báo rằng đơn hàng ${order_id} của bạn đã bị hủy.
        </p>
        <p>
            Hãy kiểm tra kỹ thông tin đơn hàng của bạn. Nếu có bất kỳ vấn đề gì, vui lòng liên hệ với chúng tôi qua email hoặc số hotline để được hỗ trợ.

            Một lần nữa, xin chân thành cảm ơn và rất mong được phục vụ bạn trong thời gian sớm nhất.
        </p>

        <p style='text-align: right; font-weight: 600;'>Trân trọng,</p>
        `,
  };

  switch (status) {
    case "pending":
      mailOptions = mailForPending;
      break;
    case "confirmed":
      mailOptions = mailForConfirmed;
      break;
    case "preparing":
      mailOptions = mailForPreparing;
      break;
    case "delivering":
      mailOptions = mailForDelivering;
      break;
    case "completed":
      mailOptions = mailForCompleted;
      break;
    case "canceled":
      mailOptions = mailForCancelled;
      break;
    default:
      break;
  }

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

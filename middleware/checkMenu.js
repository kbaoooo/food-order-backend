import jwt from "jsonwebtoken";

export const checkMenuMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.body.user_id = null;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.user_id = decoded.user_id;
    next();
  } catch (error) {
    console.error(error);
    req.body.user_id = null;
  }
};

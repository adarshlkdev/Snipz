import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    httpOnly: true, //cookie cannot be accessed by client side script
    sameSite: "strict", //cookie is only sent to the same site as the request
    secure: process.env.NODE_ENV !== "development", //cookie is only sent
  });
};

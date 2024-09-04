const { serialize } = require("cookie");
const { sign } = require("jsonwebtoken")

const MAX_AGE = -1;


const logoutController = (req, res, next) => {
  const secret = "kucinggarong"
  const username = "username"
  
  const token = sign({
    username,
  }, secret,  {
    expiresIn: MAX_AGE
  })

  const serialized = serialize("SentimenJWT", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  })

  const response = {
    message: "Logged out!",
  }

  return res.status(200).set({ "Set-Cookie": serialized }).json(response);
}

module.exports = logoutController
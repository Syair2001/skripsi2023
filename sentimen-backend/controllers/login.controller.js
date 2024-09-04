const { serialize } = require("cookie");
const { sign } = require("jsonwebtoken")

const MAX_AGE = 60*60*24*30;

const loginController = (req, res) => {
  const {username, password} = req.body

  if (username !== "admin" || password !== "12345678") {
    res.status(401).json({
      "message": "unauthenticated"
    })
  }

  const secret = "kucinggarong"

  const token = sign({
    username,
  }, secret,  {
    expiresIn: MAX_AGE
  })

  const serialized = serialize("SentimenJWT", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  })

  const response = {
    message: "Authenticated!",
  }

  return res.status(200).set({ "Set-Cookie": serialized }).json(response);
}

module.exports = loginController
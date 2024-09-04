const { verify } = require("jsonwebtoken")

const isAutenticated = (req, res, next) => {
  const token = req.cookies.SentimenJWT

  if (!token) {
    return res.status(401).json({
      "message": "Unauthorized!"
    })
  }

  const secret = "kucinggarong"

  try {
    verify(token, secret)
    next()
  } catch (error) {
    return res.status(400).json({
      "message": `Something went wrong: ${error}`
    })
  }
}

module.exports = isAutenticated
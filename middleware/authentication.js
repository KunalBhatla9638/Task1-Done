const jwt = require("jsonwebtoken");
const SECRETKEY = process.env.SECRETKEY;

const authenticateMiddleW = (req, res, next) => {
  const beared = req.headers["authorization"];

  if (typeof beared !== "undefined") {
    const beard = beared.split(" ");
    const rawToken = beard[1];
    jwt.verify(rawToken, SECRETKEY, (err, success) => {
      if (err) {
        return res
          .status(401)
          .json({ Token: "Authentication token not valid" });
      }
      console.log("Token  is valid");
      next();
    });
  } else {
    res.status(401).json({ Token: "Authentication token not provided" });
  }
};

module.exports = {
  authenticateMiddleW,
};

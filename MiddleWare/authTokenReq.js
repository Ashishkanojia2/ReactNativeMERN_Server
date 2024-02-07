const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
require("dotenv").config();

module.exports = (req, res, next) => {
  const {authorization} = req.headers;
  console.log("======================1==============");
  console.log(authorization);
  console.log("====================================");
  if (!authorization) {
    return res
      .status(422)
      .send({ error: "you must be logged in , key  not define" });
  }

  const token = authorization.replace("Bearer ", "");
  console.log("===================2=================");
  console.log(token);
  console.log("====================================");

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({
        error: "you must be loged in ,token invalid got ot login page",
      });
    }
    const { _id } = payload;
    // const user = await User.findById(_id);
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};

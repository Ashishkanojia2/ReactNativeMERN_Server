const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//
require("dotenv").config();
//

router.post("/signup", (req, res) => {
  //res.send("this is signup page Postman ");
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(422)
      .send(console.error("please fill the all fields Updated"));
  }
  // IF USER IS ALREADY EXISTS THEN SHOW ERROR
  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).send({ error: "invalid Credentials" });
    }
    // ELSE CREATE NEW USER
    const user = new User({
      name,
      email,
      password,
    });
    try {
      await user.save();
      //res.send({ message: "user Saved sucessfully" });
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET); // FOR THIS LINE TOKEN IS GENERATED  THEN NEXT LINE IS USED TO SEND RESPONSE  TO FORNTEND
      res.send({ token });
    } catch (err) {
      console.log("db error", err);
      return res.status(422).send({ error: err.message });
    }
  });
});

router.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  const savedUser = await User.findOne({ email: email });

  if (!savedUser) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }
  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        console.log(
          "password match when user have an accoutn and they login our same id and password"
        );
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        res.send({ token });
      } else {
        console.log("==================6==================");
        console.log("password does not match");
        console.log("====================================");
        return res.status(422).json({ error: "invalid Credentials 5" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

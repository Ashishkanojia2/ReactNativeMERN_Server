const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//
require("dotenv").config();
//
const nodemailer = require("nodemailer");

//node mailler
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kanojiaashish1975@gmail.com",
    pass: "xuvjzbwwtzgcwxrr",
  },
});

async function mailler(reciverEmail, code) {
  const info = await transporter.sendMail({
    from: "kanojiashish1975@gmail.com", // sender address
    to: `${reciverEmail}`, // list of receivers
    subject:
      "Verification Code Please don't share this to anyOne. This is for your Account Protction. I Hope you underStand.", // Subject line
    text: `Your Code is ${code}`, // plain text body
    html: `<b>Your Verfication Code is ${code}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
}
//

router.post("/signup", async (req, res) => {
  //res.send("this is signup page Postman ");
  console.log("sent by client - ", req.body);
  const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   return res
  //     .status(422)
  //     .send(console.error("please fill the all fields Updated"));
  // }
  // IF USER IS ALREADY EXISTS THEN SHOW ERROR
  // User.findOne({ email: email }).then(async (savedUser) => {
  //   if (savedUser) {
  //     return res.status(422).send({ error: "invalid Credentials" });
  //   }
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
      res.send({ message: "User Register SuccessFully",token });
    } catch (err) {
      console.log("db error", err);
      return res.status(422).send({ error: err.message });
    }
  });


router.post("/verify", (req, res) => {
  console.log("sent by client - ", req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(422)
      .send(console.error("please fill the all fields Updated"));
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).send({ error: "invalid Credentials" });
    }
    try {
      let VerificationCode = Math.floor(100000 + Math.random() * 900000);
      let user = [{ name, email, password, VerificationCode }];
      await mailler(email, VerificationCode);
      res.send({ message: "Verification Code Sent", udata: user });
      console.log(VerificationCode);
    } catch (err) {
      console.log(err);
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
          "password matched when user have an accoutn and they login our same id and password"
        );
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        res.send({ token });
      } else {
        console.log("==================6==================");
        console.log("password does not match");
        console.log("====================================");
        return res
          .status(422)
          .json({ error: "No User Avaliable.. Try to SignIn" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

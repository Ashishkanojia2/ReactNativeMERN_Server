const express = require("express");
const { default: mongoose } = require("mongoose");
const mongosse = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongosse.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

//bcrypt the password  for secure the code

userSchema.pre("save", async function (next) {
  const user = this;

  console.log("=================4===================");
  console.log("just before saving data without hasing", user.password);
  console.log("====================================");
  if (!user.isModified("password")) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 8);
  console.log("=================5===================");
  console.log(" after hashing data", user.password);
  console.log("====================================");
  next();
});

mongoose.model("User", userSchema);

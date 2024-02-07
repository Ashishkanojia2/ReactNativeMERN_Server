const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connect successfully");
  })
  .catch((err) => {
    console.log("CouldN't Connect to db " + err);
  });

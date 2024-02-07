const express = require("express");

const PORT = 3000;
const app = express();

const bodyParse = require("body-parser");
//
require("./db")
require("./modals/User")
//
const authRoutes = require('./routes/authRoutes')
const requireToken = require("./MiddleWare/authTokenReq")
//
app.use(bodyParse.json()); // THIS LINE IS CONVERT DATA INTO JASON FORMAT  THOSE DATA WHICH IS RETRIVING FROM DATABASE
app.use(authRoutes)
//

app.get("/", requireToken,(req, res) => {           // HERE WE ADD MIDDLEWARE TO CHECK VALID USER OR NOT 
  res.send(req.user);
  console.log('=======================*****=============');
  console.log(req.user);
  console.log('====================================');
  // console.log("server runnig on this Port ", $(PORT));
});
app.post("/signup", (req, res) => {
    console.log(req.body)
  res.send("this is Home Page from login Screen  ");
 });
app.listen(PORT); 

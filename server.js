const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const { check, validationResult } = require("express-validator");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("it working");
});

app.post(
  "/signin",
  [
    // username must be an email
    check("email")
      .isEmail()
      .withMessage("Email must email & cannot be null"),
    // password must be at least 5 chars long
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long")
  ],
  (req, res) => {
    signin.handleSignin(req, res, db, bcrypt, validationResult);
  }
);

app.post(
  "/register",
  [
    check("name")
      .notEmpty()
      .withMessage("Name cannot be null"),
    // username must be an email
    check("email")
      .isEmail()
      .withMessage("Email must email & cannot be null"),
    // password must be at least 5 chars long
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long")
  ],
  (req, res) => {
    register.handleRegister(req, res, db, bcrypt, validationResult);
  }
);

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageUrl", (req, res) => {
  image.handleImageUrlApi(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

/*
- /signin --> POST = success/fail
- /register --> POST = user
- /profile/:userId --> GET = user
- /image --> PUT = user 

*/

const express = require("express");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const util = require("util");
const mysql = require("mysql");
// const dotenv = require("dotenv").config();

const db = require("./db/config");
const { hbsHelpers } = require("./views/helpers");
const { getSessionUser,getHashedPassword} = require("./routes/auth");
var router = require('./routes/index');
const bcrypt = require("bcrypt");
const {User,Schedule} = require("./db/models");

  const app = express();


  // Set up view engine
  const hbs = exphbs.create({
    extname: ".hbs",
    helpers: hbsHelpers,
  });
  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");

  // Need to be able to read body data
  app.use(bodyParser.urlencoded({ extended: true })); // parse POST data
  app.use(express.json());
  app.use(cookieParser('secret'));   // use cookie parser before router

  app.use(router);

  // Register middlewares

  // app.use(session(getSessionUser));

  app.use(express.json());


  

  // Login Route
  app.get('/login',(req,res)=>res.render(('login'), {
  }));

  // Signup Route
  app.get('/signup',(req,res)=>res.render(('signup'), {
  }));

  // Homepage Route
  app.get('/login/home',(req,res)=>res.render(('home'), {
  }));



  app.listen(process.env.PORT || 3000);





const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { User } = require("../db/models");
const db = require("../db/config");
var async = require('async');
const cookieParser = require("cookie-parser");

// we store the tokens in-memory for simplicity's sake
// in production we'd make them persistent
const authTokens = {};


module.exports = {

  setAuthToken : (userId) => {

    return new Promise(function(resolve,reject){
      jwt.sign({userId},'secretAccessKey',{expiresIn: '10m'},(err,token) =>{
      
      resolve(token)

     })
    })
    
  },
  // generateRefreshToken : (userId) => {

  //      return jwt.sign({userId},'secretRefreshKey',{expiresIn: '1h'},(err,token) =>{
  //       console.log(token)
  //       res.json({
  //         token
  //       })
  //   })
  // },

  getSessionUser: (req, res, next) => {
    const session =
    {
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {  }
    }
    return session;
  },

  requireAuth: (req,res,next) => {
    
    const token= req.cookies['AuthToken'];

    if(token === 'undefined'){
        res.render('login', {
        message: 'Please login to continue',
        messageClass: 'alert-danger'
      });
    }else{
      jwt.verify( token,'secretAccessKey',(err,user)=>{
        if(err){
          res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
          });
        }else{
          req.user = user;
          next();
        }
      });
    }

  },
  
  unsetAuthToken: (req, res) => {
    res.clearCookie('AuthToken')
    res.redirect("/login");

  },


  getHashedPassword: async(password) => {
    try{
      const salt = await bcrypt.genSalt(10);
      const hash =  await bcrypt.hash(password,salt);
      return hash;
    }catch (ex){
      console.log(ex.message)

    }
        // const sha256 = crypto.createHash('sha256');
        // const hash = sha256.update(password).digest('base64');
        // return hash;
    
  },

  requireAuthToken: (req,res, next) => { // Need to use postman https://www.youtube.com/watch?v=7nafaH9SddU
    // Make sure login user is the same user as sending request to server

      // Get auth header value
      const bearerHeader = req.headers['authorization'];
      console.log(bearerHeader)

      try{
        
        // if (typeof bearerHeader !== 'undefined')

        // FORMAT OF TOKEN
        // Authorization: Bearer <accessToken>
        // Split at space, after bearer
        const bearer = bearerHeader.split(' ');

        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;

        jwt.verify(req.token, 'secretAccessKey',(err,user)=>{
          if(err){
            return res.sendStatus(403);       
          }else{
              // Next middleware
            next();
          }
        })
        
      }catch(ex){
        console.log(ex.message)
          res.render('login', {
          message: 'Please login to continue',
          messageClass: 'alert-danger'
        });
      }

  },


};

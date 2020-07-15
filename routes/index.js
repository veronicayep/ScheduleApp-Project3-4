const { setAuthToken, requireAuth, unsetAuthToken, getHashedPassword } = require("./auth");
const { User, Schedule } = require("../db/models");
const { hbsHelpers } = require("../views/helpers");
const db = require("../db/config");
const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
// var async = require('async');



    router.get("/login", (req, res) => {
      res.render("login");
   });

    router.get("/signup", (req, res) => {
      res.render("signup");
    });


// ----------------------------Submit login---------------------------// 

var authTokens = {};

    router.post("/login", async(req, res) => {

      const userData = await User.getAllUser();
      try{
        const { email, password } = req.body;
        //console.log(userData)
        const user = userData.find(user =>user.email === email)

        getHashedPassword( password).then( async function(result){
          const hashedPassword = result;

        // 1. Find user in database. If not exist send error 
          if(user == null){
            res.render('login', {
              message: 'User is not exist',
              messageClass: 'alert-danger'
            });
          }
          try {
            // 2. Compare encrypted password and see if they are the same.
            const compareResult = await bcrypt.compare(password, user.password)
            if(compareResult){
              console.log(" Password match!!")
                if (user) {

                  console.log("creating token...")
                 // 3. Create refresh token and access token
                 setAuthToken(user.id).then(function(result){
                    const accessToken =  result;

                    // 4.  Store authentication token
                    // authTokens[accessToken] = user; // store user info in auth tokens

                    // Setting the access token in cookies, where 'AuthToken' is the property name in cookie
                    res.cookie('AuthToken',accessToken);
                      
                    //Redirect user to the home page
                    res.redirect('/home'); 
                  });
                    
                };  
            }else {
                  res.render('login', {
                      message: 'Invalid username or password',
                      messageClass: 'alert-danger'
                  });
            }

          }catch(ex){
            console.log(ex.message)
            res.status(500).send()
          };

        }); // end of getHashedPassword function
      }catch(ex){
        console.log(ex.message)
      }
    
    
  })
  // -------------------------Access to Homepage (All schedules)---------------------------//   
    router.get("/home", requireAuth, async (req, res) => { 

          const { id } = req.params;
          console.log(req.user)

          try  {
              console.log("trying to get all users schedule...")
              const  scheduleResult = await Schedule.getAllData();
                  res.render(('home'),{
                    user: req.user,
                    schedules:scheduleResult,
                  })

          } catch(ex) {
                  console.log(ex.message)
                  res.render('login', {
                    message: 'Please login to continue',
                    messageClass: 'alert-danger'
                });
          }
      });
//-----------------------------------------Logout-----------------------------//

    router.get("/logout",unsetAuthToken, (req, res) => {

      res.redirect('/login');
      
    });
//------------------------------Check user schedule-----------------------------//

    router.get("/user/:id", requireAuth, async function(req,res) {
      const { id } = req.params;

        try{
          const userSchedules = await Schedule.getUserSchedule(id); 
              console.log(req.user);
              res.render(('user'),{
                user: req.user,
                userSchedules:userSchedules,  
              })
        }catch(ex){
          console.log(ex.message)
        }


    });
//----------------------------------------manage schedule------------------------------//
    router.get("/schedule", requireAuth, async(req, res) => {
      const id = req.user.userId;
      try{
        const userSchedules = await Schedule.getUserSchedule(id); 
            res.render(('schedule'),{
              user: req.user,
              userSchedules:userSchedules,  
            })
      }catch(ex){
        console.log(ex.message)
      }

    });
 //----------------------------------------add schedule------------------------------//
    router.post("/schedule", requireAuth, async(req, res) => {
      const id = req.user.userId;
      const newSchedule = {
          dayOfWeek: req.body.day,
          startTime: req.body.startTime,
          endTime: req.body.endTime
      }
  
      if( !newSchedule.dayOfWeek ||!newSchedule.startTime|| !newSchedule.endTime){
          return res.status(400).json({msg:'Please include all the required field'});
      }
        
        await Schedule.createNewSchedule(newSchedule,id).then(async function(result){
          console.log(result)
          const userSchedules = await Schedule.getUserSchedule(id); 
          // res.render("schedule",{
          //   user:req.user,
          //   userSchedules:userSchedules,
          //   message: 'A new schedule is added',
          //   messageClass: 'alert-success'
          // });
          res.redirect("/schedule");
          
        })

    });

    //----------------------------------------sign up------------------------------//

    router.post("/signup", async (req, res) => {
      const { id } = req.params;
      const userData = await User.getAllUser();
        const { firstName, surname , email, password, confirmPassword } = req.body;

        // Check if the password and confirm password fields match
        if (password === confirmPassword) {

              // Check if user with the same email is also registered

                const user = await userData.find(user =>user.email === email) 
                if(user){
                  res.render('signup', {
                    message: 'User already registered.',
                    messageClass: 'alert-danger'
                  });
                }
                else{
                  
                    getHashedPassword( password).then(function(result){
                      console.log(result)
                      const hashedPassword = result;
                      
                      // Store user into the database if you are using one
                      var sql = "INSERT INTO users (surname,firstname, email, password) VALUES ?";
                      var values = [[surname, firstName, email, hashedPassword]];
                      db.query(sql,[values], function (err, result) {
                          if (err) throw err;
                          console.log("1 record inserted into users database");
                      });
                    });

                    res.render('login', {
                      message: 'Registration Complete. Please login to continue.',
                      messageClass: 'alert-success'
                  });
                    }

        } else {
              res.render('signup', {
                  message: 'Password does not match.',
                  messageClass: 'alert-danger'
              });
          }
        })



module.exports = router;

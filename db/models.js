const { setAuthToken, getHashedPassword } = require("../routes/auth");
const { hbsHelpers } = require("../views/helpers");
const db = require("./config");

module.exports.User =  {

  // function 1: call to db to get user info by passing their id
   getUserData: (id) =>{
      return new Promise ((resolve, reject) =>{
         db.query("SELECT * FROM users WHERE id = ?", [id],function (err, result) {
            if (err) reject(err);
            resolve(result)
         });
      })
   },
   

  // function 2: auth the user (for login)
   getLoginAuth: (setAuthToken)=>{
     

   },


  // function 3: validate a new sign-up

  // function 4: Get all user data
  getAllUser:() =>{
   return new Promise ((resolve, reject) =>{
      db.query("SELECT * FROM users",function (err, result) {      
         if (err) reject(err);
         resolve(result)
      });
   });
  },
};



module.exports.Schedule = {
  // function 1: get all schedules
  getAllData: ()=>{ 
      return new Promise ((resolve, reject) =>{
         db.query("SELECT * FROM schedules INNER JOIN users ON users.id = schedules.userId", function (err, result) {
            if (err) reject(err);
            resolve(result)
         })
      })
   },

  // function 2: get all schedules for logged in user
  getUserSchedule: (id)=>{
   return new Promise ((resolve, reject) =>{
      db.query("SELECT firstname, surname, email, dayOfWeek, startTime,endTime FROM schedules INNER JOIN users ON users.id = schedules.userId WHERE schedules.userId = ?"
      , [id], function (err, result){
         if (err) reject(err);
         resolve(result);
         }
      )
   });
  },

   // function 3: create new schedule entry

   createNewSchedule: (newSchedule,id)=>{

      return new Promise ((resolve, reject) =>{
         var sql = "INSERT INTO schedules (userId, dayOfWeek, startTime, endTime) VALUES ?";
         var values = [[ id,newSchedule.dayOfWeek,newSchedule.startTime, newSchedule.endTime]];
         db.query(sql,[values], function (err, result) {
            if (err) reject(err);
            resolve("1 record inserted in database");
         });
      });
   }
   
};

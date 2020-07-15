const exphbs = require("express-handlebars");

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

module.exports = {
  hbsHelpers: {
    getDay: (value) => {
     return weekdays[value-1];
    },

    getDayInNumber: (value) =>{
      for(i = 0; i < weekdays.length; i ++){
        if(value == weekdays[i]){
          return i+1;
        }
      }
    },
    // truncTime: (value) => {
    //   var timeStart = value.CreateDate.replace(/\/Date\((-?\d+)\)\//, '$1');
    // var d = new Date(parseInt(timeStart));
      
    // },
  },
};

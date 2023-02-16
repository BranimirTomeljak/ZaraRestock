var express = require("express");
const db = require("../db");
var Tracking = require("../models/TrackingModel");
var router = express.Router();
const add_hour = (date) => {
  date.setHours(date.getHours() + 1);
  return date;
};
const curr_date_factory = () => {
  return add_hour(new Date());
};

router.post("/create", async function (req, res) {

  const tracking_factory = (time, doctorid, nurseid, type) => {
    return new Tracking(
      undefined,
      undefined,
      doctorid,
      nurseid,
      time,
      "00:" + appointment_duration + ":00",
      undefined,
      undefined,
      type
    );
  };

  const check_errors = async(app) => {  
    if (await app.conflictsWithDb()){
      res.status(500).send('Appointment overlaps.')
      return true
    }
    else if (await app.isSavedToDb())
    {
      res.status(500).send('Appointment exists.')
      return true
    }
    return false
  }

  const save_to_db = async(app) => {
    await app.saveToDb()   
    return true 
}
});

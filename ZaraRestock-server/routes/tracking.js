var express = require("express");
var router = express.Router();
//const db = require("../db");
var Tracking = require("../models/TrackingModel");

const add_hour = (date) => {
  date.setHours(date.getHours() + 1);
  return date;
};
const curr_date_factory = () => {
  return add_hour(new Date());
};

router.post("/create", async function (req, res) {
  let { userid, url, size, until } = req.body;

  let tracking = tracking_factory(userid, url, size, until);

  if (await tracking.conflictsWithDb())
    res.status(500).send("Same tracking details exist.");
  else if (await tracking.isSavedToDb())
    res.status(500).send("Tracking exists.");
  else if (await tracking.isRightFormat())
    res.status(500).send("Not right format Zara url.");
  else {
    await save_to_db(tracking);
    res.json(tracking);
  }
});

const tracking_factory = (userid, url, size, until) => {
  return new Tracking(
    undefined,
    userid,
    url,
    size,
    curr_date_factory().toISOString().slice(0, 19).replace("T", " "),
    until
  );
};

const save_to_db = async (tracking) => {
  await tracking.saveToDb();
  return true;
};

module.exports = router;

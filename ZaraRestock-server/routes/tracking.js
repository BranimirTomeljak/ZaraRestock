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

router.get("/", async function (req, res) {
  let { userid } = req.query;
  var trackings = await Tracking.getAllByUserId(userid);
  res.json(trackings);
});

router.post("/create", async function (req, res) {
  let { userid, url, sizes, until } = req.body;
  const now = (new Date());
  if (until == "1 week")
    until = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  else if (until == "1 month")
    until = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  else if (until == "6 months")
    until = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
  else if (until == "1 year")
    until = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  else until = undefined;

  for (let size of sizes) {
    let tracking = tracking_factory(userid, url, size, until);

    if (await tracking.conflictsWithDb())
      res.status(500).send("Same tracking details exist.");
    else if (await tracking.isSavedToDb())
      res.status(500).send("Tracking exists.");
    else {
      await save_to_db(tracking);
      res.json(tracking);
    }
  }
});

const tracking_factory = (userid, url, size, until) => {
  return new Tracking(
    undefined,
    userid,
    url,
    size,
    curr_date_factory().toISOString().slice(0, 19).replace("T", " "),
    until.toISOString().slice(0, 19).replace("T", " "),
    "in-progress"
  );
};

const save_to_db = async (tracking) => {
  await tracking.saveToDb();
  return true;
};

module.exports = router;

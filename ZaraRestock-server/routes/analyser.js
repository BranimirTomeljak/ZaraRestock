var express = require("express");
const Tracking = require("../Models/TrackingModel");
const Notification = require("../Models/NotificationModel");
const Analyser = require("../models/AnalyserModel");
var router = express.Router();

router.post("/sizes", async function (req, res) {
  var sizes = await Analyser.getSizes(req.body.url);

  if (sizes == false) res.status(404).send("Error fetching sizes.");
  else res.json(sizes);
});

router.post("/check", async function (req, res) {
  available = await Analyser.checkSizeAvailability(req.body.url, req.body.size);
  if (available) res.sendStatus(200);
  else res.sendStatus(404);
});

async function runPeriodically() {
  //setInterval(async () => {
  var inProgress = await Tracking.getInProgress();
  for (var tracking of inProgress) {
    const result = await Analyser.checkSizeAvailability(
      tracking.url,
      tracking.size
    );
    console.log(`Result of checking id ${tracking.id}: ${result}`);

    if (result) {
      tracking.success = "true";
      await tracking.updateDb();
      Notification.sendEmail("found", tracking);
    } else if (tracking.until < new Date()) {
      tracking.success = "false";
      await tracking.updateDb();
      Notification.sendEmail("timeout", tracking);
    }

    //await new Promise((resolve) => setTimeout(resolve, 1000));  //svaka iteracija se vrti 1 sekundu -> namistit za nas slucaj(random takoder)
  }
  //}, Math.floor(Math.random() * 30000) + 60000); // random[60, 90] seconds
}

//runPeriodically();

module.exports = router;

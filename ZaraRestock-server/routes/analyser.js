var express = require("express");
//const db = require("../db");
const Tracking = require("../Models/TrackingModel");
const Notification = require("../Models/NotificationModel");
const Analyser = require("../models/AnalyserModel");
var router = express.Router();

router.post("/sizes", async function (req, res) {
  /*var sizes = await Analyser.getSizes(
    "https://www.zara.com/hr/hr/haljina-od-strukturirane-tkanine-p06560267.html?v1=207813905&utm_campaign=productMultiShare&utm_medium=mobile_sharing_Android&utm_source=red_social_movil"
  );*/
  var sizes = await Analyser.getSizes(req.body.url);
  res.json(sizes);
});

router.post("/check", async function (req, res) {
  /*available = await Analyser.checkSizeAvailability(
    "https://www.zara.com/hr/hr/elasticna-majica-sa-sirokim-naramenicama-p03905931.html?v1=232669686",
    "L"
  );*/
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
      Notification.sendEmail("found", tracking);
      tracking.success = "true";
      await tracking.updateDb();
    } else if (tracking.until < new Date()) {
      Notification.sendEmail("timeout", tracking);
      tracking.success = "false";
      await tracking.updateDb();
    }

    //await new Promise((resolve) => setTimeout(resolve, 1000));  //svaka iteracija se vrti 1 sekundu -> namistit za nas slucaj(random takoder)
  }
  //}, Math.floor(Math.random() * 30000) + 60000); // random[60, 90] seconds
}

//runPeriodically();

module.exports = router;

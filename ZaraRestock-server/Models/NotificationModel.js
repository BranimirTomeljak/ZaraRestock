const nodemailer = require("nodemailer");
//const db = require("../db");
//const { User } = require("../models/UserModel");

async function sendEmail(purpose, tracking) {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "zararestock@outlook.com",
      pass: "zararestock1950",
    },
  });

  var options = {
    from: "zararestock@outlook.com",
    to: tracking.mail,
    subject: getPurposeSubject(purpose),
    html: await getPurposeMessage(purpose, tracking),
  };
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Send: " + info.response);
  });
}

function getPurposeSubject(purpose) {
  if (purpose == "found")
    return "Your tracked item on Zara is in stock";
  else if (purpose == "timeout")
    return "Your tracking for Zara item time-outed";
  else return undefined;
}

async function getPurposeMessage(purpose, tracking) {
  if (purpose == "found")
    return `Your item ${tracking.url} is in stock.<br /><br />
    <a href="${tracking.url}">Click here</a> `;
  else if (purpose == "timeout")
    return `Tracking for your <a href="${tracking.url}">Zara item</a> ended.`;
  else return undefined;
}

module.exports = {
  sendEmail: sendEmail,
};

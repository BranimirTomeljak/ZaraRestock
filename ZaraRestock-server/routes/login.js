var express = require("express");
var router = express.Router();
const passport = require("passport");
const { User, Admin } = require("../models/UserModel");

router.post(
  "/",
  passport.authenticate("local", { failureFlash: true }),
  async function (req, res) {
    let { mail } = req.body;
    let user = await User.fetchBymail(mail);

    let id = user.id;
    if (req.session === undefined) req.session = {};
    if (await user.isUser()) req.session.user = await User.fetchById(id);
    else if (await user.isAdmin()) req.session.user = await Admin.getById(id);
    req.session.save();
    res.json(req.session.user);
  }
);

router.get("/startup", async function (req, res) {
  let { userid } = req.query;
  let user = await User.fetchById(userid);
  console.log(user);
  if (req.session === undefined) req.session = {};
  if (await user.isUser()) req.session.user = user;
  else if (await user.isAdmin()) req.session.user = await Admin.getById(userid);
  req.session.save();
  console.log("Logged in backend");
  res.json(req.session.user);
});

module.exports = router;

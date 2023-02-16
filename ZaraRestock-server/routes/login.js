var express = require("express");
var router = express.Router();
const passport = require("passport");
const { User, Admin } = require("../models/UserModel");

router.post(
  "/",
  passport.authenticate("local", { failureFlash: true }),
  async function (req, res) {
    let { username } = req.body;
    let user = await User.fetchByUsername(username);

    let id = user.id;
    if (req.session === undefined) req.session = {};
    if (await user.isUser()) req.session.user = await User.fetchById(id);
    else if (await user.isAdmin()) req.session.user = await Admin.getById(id);
    req.session.save();
    res.json(req.session.user);
  }
);

module.exports = router;
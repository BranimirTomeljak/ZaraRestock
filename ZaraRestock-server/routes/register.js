var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../Models/UserModel");

router.post("/", async (req, res) => {
  let { mail, password } = req.body;

  let user = await User.fetchBymail(mail);
  if (user !== undefined) res.status(400).send("Email already registered.");

  hashedPassword = await bcrypt.hash(password, 10);

  let person = new User(undefined, mail, hashedPassword);
  try {
    await person.saveUserToDb();
    person = await User.fetchBymail(mail);
    console.log(person);
    res.json(person);
  } catch {
    console.log("problem with saving, going to rm");
    try {
      await person.removeUserFromDb();
    } catch {
      console.log("could not rm from db");
    }
    res.sendStatus(400);
  }
  return person;
});

module.exports = router;

var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/UserModel");

/*router.get("/doctors", async function (req, res) {
  let doctors = await Doctor.getIdNameSurnameOfAll();
  res.json(doctors);
});*/

/*
The following 4 endpoints are accesed in the same way.
The body encoded in a x-www-form-urlencoded way has to have:
  (key: value type):
  username: string
  mail: string, *@*.* (has to be unique)
  password: string
If everything is ok you get OK you get 200 else error msgs
*/
router.post("/", async (req, res) => {
  await check_and_put(req, res, User);
});

const check_and_put = async (req, res, where) => {
  let { username, mail, password } = req.body;

  let errors = [];

  // check for errors
  if (!username || !mail || !password) {
    errors.push({ message: "Please enter all fields" });
    console.log("1");
    res.sendStatus(400);
    return;
  }

  if (password?.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
    console.log("2");
    res.sendStatus(400);
    return;
  }

  let user = await User.fetchBymail(mail);
  if (user !== undefined) {
    errors.push({ message: "Email already registered" });
    console.log("3");
    res.sendStatus(400);
    return;
  }

  user = await User.fetchByUsername(username);
  if (user.id !== undefined) {
    errors.push({ message: "Username already registered" });
    console.log("4");
    res.sendStatus(400);
    return;
  }

  // actually add the person to the database
  hashedPassword = await bcrypt.hash(password, 10);

  let person = new where(undefined, username, mail, hashedPassword);
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
};

module.exports = router;

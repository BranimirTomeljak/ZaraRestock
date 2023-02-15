var express = require("express");
var path = require("path");
var app = express();

const cors = require('cors');
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const initializePassport = require("./db/passportConfig");
initializePassport(passport);

var dataRouter = require("./routes/data");
var analyserRouter = require("./routes/analyser");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Key we want to keep secret which will encrypt all of our information
    resave: false, // Should we resave our session variables if nothing has changes which we dont
    saveUninitialized: false, // Save empty value if there is no vaue which we do not want to do
  })
);
app.use(passport.initialize()); // Function inside passport which initializes passport
app.use(passport.session()); // Store our variables to be persisted across the whole session. Works with app.use(Session) above

app.use("/api/data", dataRouter);
app.use("/api/analyser", analyserRouter);

module.exports = app;

app.listen(PORT, "0.0.0.0", function () {
  console.log("Listening to port:  " + PORT);
});

//const bodyParser = require("body-parser");
//const { Client } = require("pg");

/*const client = new Client({
  host: "localhost",
  port: 5432,
  database: "zararestock",
  user: "postgres",
  password: "postgres",
});*/

//client.connect();

/*app.post("/api/data", (req, res) => {
    console.log(req.body);
    res.status(200).send({ message: 'Success' });
});*/

/*app.post("/data", async (req, res) => {
  const { value } = req.body;
  console.log(value);
  try {
    await client.query("INSERT INTO data (value) VALUES ($1)", [value]);
    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.json({ status: "error" });
  }
});*/

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var app = express();

const cors = require('cors');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const flash = require("express-flash");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const initializePassport = require("./db/passportConfig");
initializePassport(passport);

var analyserRouter = require("./routes/analyser");
var loginRouter = require("./routes/login");
var registerRouter = require("./routes/register");
var testRouter = require("./routes/test");
var trackingRouter = require("./routes/tracking");

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
app.use(flash());
app.use(cookieParser());

app.use("/api/analyser", analyserRouter);
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/test", testRouter);
app.use("/api/tracking", trackingRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;

app.listen(PORT, "0.0.0.0", function () {
  console.log("Listening to port:  " + PORT);
});
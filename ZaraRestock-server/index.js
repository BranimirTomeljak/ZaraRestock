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
var logoutRouter = require("./routes/logout");
var registerRouter = require("./routes/register");
var trackingRouter = require("./routes/tracking");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());

app.use("/api/analyser", analyserRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/register", registerRouter);
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
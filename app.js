const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1/pws-db";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "PWS (Plant Watering System)",
      version: "0.1.0",
      description:
        "Back-end API of multi-layered information system made for practical part of diploma thesis. Complete functioning product is made out of 3 repositories, this is covering only database related work.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "JanaJankovic",
        url: "https://github.com/JanaJankovic",
        email: "jana.jankovic@student.um.si",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(options);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/usersRoutes");
const plantsRouter = require("./routes/plantRoutes");
const recipientsRouter = require("./routes/recipientRoutes");
const requestsRouter = require("./routes/arduinoRequestRoutes");
const reponsesRouter = require("./routes/arduinoResponseRoutes");
const graphRouter = require("./routes/graphDataRoutes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/api", swaggerUi.serve, swaggerUi.setup(specs));

const session = require("express-session");
app.use(
  session({
    secret: "work hard",
    resave: true,
    saveUninitialized: false,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/plants", plantsRouter);
app.use("/recipients", recipientsRouter);
app.use("/requests", requestsRouter);
app.use("/responses", reponsesRouter);
app.use("/graph_data", graphRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

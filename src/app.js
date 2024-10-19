const path = require("path");
const express = require("express");
const app = express();
const upload = require("express-fileupload");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const serveIndex = require("serve-index");
const morgan = require("morgan");
const { swaggerServe, swaggerSetup } = require("./global/swaggerSetup");
const db = require("./models");

// internal import
const {
  notFoundHandler,
  defaultErrorHandler,
} = require("./middleware/errorhandler");
const routes = require("./routes/index");

// request handler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// track request
app.use(morgan("dev"));

// cors issue setup
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

// cookie parser
app.use(cookieParser());

// serve index
app.use(
  "/public",
  express.static(path.join("/public")),
  serveIndex(path.join(__dirname, "/public"), { icons: true })
);

// upload file setup
app.use(upload());

// swagger setup must before router setup
app.use("/api-docs", swaggerServe, swaggerSetup);

// rate limiter for api request
const limiter = rateLimit({
  max: 60,
  windowMs: 60 * 1000,
  message: "Too many request from this IP, please trye again after 1 minute later"
});

// router setup
app.use("/api", limiter, routes);

// home route
app.use("/", (req, res) => {
  res.send("It's wrok...");
});

// // frontend technology linkup
// const reactBuild = path.join(__dirname, '../../frontend', 'dist');
// app.use(express.static(reactBuild));
// app.get('*', async (req, res) => {
//   res.sendFile(path.join(reactBuild, 'index.html'));
// });

// error handler
app.use(notFoundHandler);
app.use(defaultErrorHandler);

// run server
app.listen(process.env.PORT, () => {
  db.sequelize.authenticate().then(() => {
    console.log("Sequelize is running");
  });
  console.log(
    `Server is running with ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`
  );
});

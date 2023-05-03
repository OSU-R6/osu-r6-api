const express = require('express');
const cors = require('cors');

const api = require('./api');
const sequelize = require('./lib/sequelize')

const app = express();
const port = process.env.PORT || 8001;

app.use(cors({
  origin: 'http://localhost',
  credentials: true
}));

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use('/', api);

app.use('*', function (err, req, res, next) {
  console.error(err);
  res.status(500).send({
    error: "An error occurred. Try again later."
  });
})

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});



sequelize.sync().then(function () {
  app.listen(port, () => {
    console.log("== Server is running on port", port);
  });
});
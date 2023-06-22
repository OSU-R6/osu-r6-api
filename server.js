const express = require('express');
const cors = require('cors');

const api = require('./api');
const sequelize = require('./lib/sequelize')

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
  origin: 'http://localhost',
  credentials: true
}));

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
const express = require('express')
const cors = require('cors')
const https = require('https')
const fs = require('fs')

const api = require('./api')

const app = express();
const port = process.env.PORT || 8443;

app.use(cors({
  origin: true,
  credentials: true
}));

app.options('*', cors());

app.use('/', api)

app.use('*', function (err, req, res, next) {
  res.status(500).send({
    error: "An error occurred. Try again later."
  })
})

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  })
})


const privateKey = fs.readFileSync('ssl/privkey.pem')
const certificate = fs.readFileSync('ssl/fullchain.pem')

// Create HTTPS server instance
const server = https.createServer({
  key: privateKey,
  cert: certificate
}, app);


server.listen(port, () => {
  console.log("== Server is running on port", port);
})


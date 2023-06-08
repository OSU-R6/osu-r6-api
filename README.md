# OSU Rainbow Six API
This is the API to serve all data to the Oregon State Rainbow Six web application.

## Tech Stack
<a href="https://nodejs.org/en/docs/">
  <img src="https://img.shields.io/badge/Node-43853D?style=for-the-badge&logo=node.js&logoColor=white">
</a>
<a href="http://expressjs.com/">
  <img src="https://img.shields.io/badge/Express-323230?style=for-the-badge&logo=express&logoColor=61DAFB">
</a>
<a href="https://dev.mysql.com/doc/">
  <img src="https://img.shields.io/badge/mysql-%2300000f.svg?style=for-the-badge&logo=mysql&logoColor=white">
</a>
<a href="https://sequelize.org/docs/v6/">
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white">
</a>

## DB Initialization

#### Prerequisites: Docker 

#### Execute ./init/init.bat on Windows (or ./init/init.sh on Linux or MacOS) to create MySQL docker container and to populate the test data in player-clips and profile-images within ./api/uploads

## Starting API

#### npm install

#### npm run dev (Development Environment)
#### OR
#### npm start (Production Environment)
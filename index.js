const express = require('express');
const PATH = require('path');
const APP = express();
const PORT = 8080;
const HOSTNAME = 'localhost';

APP.use('/', express.static(PATH.join(__dirname, './')));

APP.get('/', (req, res) => {
    res.status(200).render('index');
});
  
APP.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
  })
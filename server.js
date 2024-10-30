const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const server = express();

server.use(bodyParser.json());
server.set('view engine', 'ejs');

server.use(express.json()); // For parsing application/json
server.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
server.use(express.static(path.join(__dirname, 'public')));


module.exports = server;
const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');

require('dotenv').config();

const app = express();

const descriptions = require('./api/descriptions');

app.use(volleyball);
app.use(cors({
  origin: true
}));
app.use((req, res, next) => { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  next(); 
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/descriptions', descriptions);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log('Listening on port', port);
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({error: err});
}
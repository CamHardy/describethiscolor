const express = require('express');
const Joi = require('@hapi/joi');
const fetch = require('node-fetch');

require('dotenv').config();

//const db = require('../db/connection');
//const descriptions = db.get('descriptions');

const schema = Joi.object({
  hexVal: Joi.string().pattern(new RegExp('^#[0-9a-f]{6}$')),
  description: Joi.string().pattern(new RegExp('^[A-Za-z0-9\\s]{1,30}$')).required(),
  token: Joi.string().trim().required()
});

const router = express.Router();

router.post('/', (req, res, next) => {
  const {error, value} = schema.validate(req.body);
  if (error === undefined) {
    console.log(value);
    console.log(process.env.RECAPTCHA_SECRET);
    console.log(value.token);
    // validate the recaptcha
    fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: JSON.stringify({
        'secret': process.env.RECAPTCHA_SECRET,
        'response': value.token
      })
    }).then(res => res.json()).then((desc) => {
      console.log(desc);
    });
    res.json(value);
  } else {
    console.log(error);
    let err = error;
    res.status(422);
    next(err);
  }
});

module.exports = router;
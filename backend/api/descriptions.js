const express = require('express');
const Joi = require('@hapi/joi');
const fetch = require('node-fetch');

require('dotenv').config();

const db = require('../db/connection');
const descriptions = db.get('descriptions');
descriptions.createIndex('hexVal');

const schema = Joi.object({
  hexVal: Joi.string().pattern(new RegExp('^#[0-9a-f]{6}$')),
  description: Joi.string().trim().pattern(new RegExp('^[A-Za-z0-9\\s]{1,30}$')).required(),
  token: Joi.string().trim().required()
});

const router = express.Router();

router.post('/', (req, res, next) => {
  const {error, value} = schema.validate(req.body);
  if (error === undefined) {
    // validate the recaptcha
    fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${value.token}`
    }).then(res => res.json()).then(desc => {
      if (desc.success && desc.hostname == process.env.DOMAIN && desc.score >= parseFloat(process.env.RECAPTCHA_THOLD)) {
        // recaptcha is valid!
        descriptions.insert({
          hexVal: value.hexVal,
          description: value.description.toLowerCase()
        }).then(insertedDesc => {
          console.log(`Inserted index ${insertedDesc.hexVal} with value ${insertedDesc.description}`);
        });
        res.json("success");
      } else {
        // recaptcha validation failed
        try {
          throw new Error('Failed recaptcha.');
        } catch (err) {
          next(err);
        }
      }
    });
  } else {
    // schema validation failed
    res.status(422);
    next(error);
  }
});

module.exports = router;
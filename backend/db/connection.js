require('dotenv').config();
const monk = require('monk');
const db = monk(`${process.env.DBUSER}:${process.env.DBPASS}@localhost/describethiscolor`, {authSource: 'admin'});

module.exports = db;
const mysql   = require('mysql');
var log4js    = require('log4js');
var logger    = log4js.getLogger();
logger.level  = 'debug';
var configs   = require('../configs.json');

/**
* This block of code is use for to create connection object of mysql database
*/
const dbConnection = mysql.createConnection({
  host     : configs.dbConfigs.host,
  user     : configs.dbConfigs.user,
  password : configs.dbConfigs.password,
  database : configs.dbConfigs.database
});

/**
* This block of code is use for to connect with mysql database
*/
dbConnection.connect((err) => {
  if(err) {
    logger.error(err);
  } else {
    logger.info('Database Connected!');
  }
});

module.exports = dbConnection; // exports database connection object

const mysql   = require('mysql');
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
    console.log(err);
  } else {
    console.log('Database Connected!');
  }
});

module.exports = dbConnection; // exports database connection object

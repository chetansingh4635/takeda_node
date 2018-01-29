var async          = require('async');
var log4js         = require('log4js');
var logger         = log4js.getLogger();
logger.level       = 'debug';
var dbConnection   = require('./dbConnection');
var _              = this;

/**
* This model method is use for to retrive branding details
*/
module.exports.createLog = function(req, res, chatLogData) {
  async.waterfall([
    function(next) {
      isLogExist(req, res, chatLogData.chat_req, next);
    },
    function(result, next) {
      if(result !== true) {
        createChatLogs(req, res, chatLogData, next);
      } else {
        updateChatLogs(req, res, chatLogData, next);
      }
    }
  ],
  function(err, result) {
    logger.error(err);
  })
};

/**
* This model method is use for to check log already exist or not in db
*/
function isLogExist(req, res, chat_req, next) {
  dbConnection.query('SELECT * FROM tbl_bot_logs WHERE chat_req = ?', [chat_req], (err, response) => {
    if(response.length > 0) {
      req.witCallsSkipped = response[0].wit_calls_skipped;
      next(null, true);
    } else {
      next(null, false);
    }
  });
}

/**
* This model method is use for to create chat log
*/
function createChatLogs(req, res, chatLogData, next) {
  let chatLogDetails = {
    log_id     : null,
    chat_req   : chatLogData.chat_req,
    chat_res   : chatLogData.chat_res,
    wit_res    : JSON.stringify(chatLogData.wit_res),
    wit_req    : JSON.stringify(chatLogData.wit_req)
  };
  dbConnection.query('INSERT INTO tbl_bot_logs SET ?', chatLogDetails, (err, response) => {
    if(err) {
      logger.error(err);
    } else {
      next(null, null)
    }
  });
}

/**
* This model method is use for update exist chat log
*/
function updateChatLogs(req, res, chatLogData, next) {
  dbConnection.query('UPDATE tbl_bot_logs SET wit_calls_skipped = ?, updated_on = ? WHERE chat_req = ?', [req.witCallsSkipped + 1, new Date(), chatLogData.chat_req], (err, response) => {
    if(err) {
      res.send(err);
    } else {
      next(null, null)
    }
  });
}

/**
* This model method is use for to retrive user query response from db
*/
module.exports.getWitResponse = function(entity, value, next) {
  var queryData = [entity,value];
  dbConnection.query('SELECT * FROM tbl_bot_reply tb LEFT JOIN tbl_bot_entities te ON te.entity_id = tb.entity_id WHERE te.entity_name = ? && tb.value= ?', queryData, (err, response) => {
    if(err) {
      logger.error(err);
    } else {
      next(null, response);
    }
  });
}

/**
* This model method is use for check repetitive query
*/
module.exports.isRepetitiveQuery = function(req, res, next) {
  dbConnection.query('SELECT * FROM tbl_bot_logs WHERE chat_req = ?', [req.body.query], (err, response) => {
    if(response.length > 0) {
      next(null, response[0]);
    } else {
      next(null, null);
    }
  });
}

/**
* This model method is use for to check entity exist or not
*/
module.exports.isEntityExist = function(req, res, next) {
  dbConnection.query('SELECT entity_name,  entity_id FROM tbl_bot_entities WHERE entity_name = ?', [req.body.entity], (err, entityResponse) => {
    if(entityResponse.length > 0) {
      next(null, entityResponse[0]);
    } else {
      next(null, false);
    }
  });
}

/**
* This model method is use for to add entity in entities table
*/
module.exports.addEtity = function(req, res, next) {
  let query = {entity_name: req.body.entity};
  dbConnection.query('INSERT INTO tbl_bot_entities SET ? ', query, (err, response) => {
    if(err) {
      res.status(500).json(err);
    } else {
      _.isEntityExist(req, res, next);
    }
  });
}

/**
* This model method is use for to add bot reply text and value in bot reply table
*/
module.exports.addBotReplyText = function(entityResponse, req, res, next) {
  var query        = [];
  var descriptions = req.body.descriptions;
  var entityID     = entityResponse.entity_id;
  var value        = req.body.value;
  for(var description in descriptions ) {
    query.push([entityID, value, descriptions[description],  0]);
  }
  dbConnection.query('INSERT IGNORE INTO tbl_bot_reply(entity_id, value, reply_text, attribute_id) VALUES ?', [query], (err, response) => {
    if(err) {
      res.status(500).json(err);
    } else {
      next();
    }
  });
}

/**
* This model method is use for to track bot error reply
*/
module.exports.trailsWitLogs = function(req, res, status) {
  let request = '"' + req.method + ' "' + req.originalUrl;
  let query   = {request : request, host : req.headers.host, query : req.body.query, response : res.response, status:status};
  dbConnection.query('INSERT IGNORE INTO tbl_wit_trails SET ?', query, (err, response) => {
    if(err) {
      logger.error(err);
    } else {
      logger.info("Wit response logged into database");
    }
  });
}

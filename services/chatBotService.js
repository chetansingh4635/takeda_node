var async      = require('async');
var _          = require('lodash');
var log4js     = require('log4js');
var logger     = log4js.getLogger();
logger.level   = 'debug';
var RiveScript = require('rivescript');
let bot        = new RiveScript({utf8 : true});
var witModel   = require('../models/witModel');

/**
* This function is use for to create response of user query based on wit response
*/
module.exports.createResponse = function createResponse(req, res, wit_res, wit_req, next) {
  if(!_.isEmpty(wit_res.entities)) {
    _.forEach(wit_res.entities, function(entityData, entity) { // Loop through all the entities from the response
        async.waterfall([
          function(next) {
            let witResponseValues = entityData.map(function(obj){return obj.value}).toString().replace(new RegExp(',', 'g'), ' ');
            filterWitResponse(req, res, witResponseValues, next);
          },
          function(userQuery, next) {
            witModel.getWitResponse(entity, userQuery, next);
          },
          function(response, next) {
            returnQueryResponses(response, next);
          }
        ],
        function(err, validResponse) {
          let queryLog = {
            wit_req    : wit_req,
            wit_res    : wit_res,
            chat_req   : wit_req.query,
            chat_res   : validResponse,
            added_on   : Date.now()
          };
          let response = {
            status     : 'success',
            message    : 'Request successfully executed',
            answer     : validResponse,
            confidence : entityData[0].confidence,
            entity     : entity,
            value      : entityData[0].value
          };
          witModel.createLog(req, res, queryLog);
          next(null, response);
        });
      return;
    });
  } else {
    let witResponse = {
      status     : 'error',
      message    : 'Please try somthing else',
      answer     : "Sorry, I did not understand your question. Please ask again"
    };
    next(null, witResponse);
  }
}

/**
* This function is use for to fetch random response from response list
*/
function returnQueryResponses(response, next) {
  var validResponse  = "";
  let responseLength = _.random(response.length) - 1;
  if(response.length > 0 && response.length === 1) {
    validResponse = response[0].reply_text;
  } else if(response.length > 1) {
    validResponse = response[responseLength].reply_text;
  } else {
    validResponse = "Sorry, I did not understand your question. Please ask again";
  }
  next(null, validResponse);
}


/**
* This block of code is use for load chatscripts
*/
bot.loadFile('./configs/chatscripts.rive', loading_done, loading_error);
function loading_done (batch_num) {
  logger.info("Batch #" + batch_num + " has finished loading!");
}

/**
* This block of code is use for catch error while loding chatscripts
*/
function loading_error (error) {
  logger.error("Error when loading files: " + error);
}

/**
* This function is use for to filter the user query
*/
function filterWitResponse(req, res, witResponseValues, next) {
  debugger
  bot.sortReplies();
  var userQuery = bot.reply("local-user", witResponseValues);
  logger.info("Wit Response = " + witResponseValues + '  Middleware Response = ' + userQuery);
  if(userQuery === 'ERR: No Reply Matched') {
    res.status(409).json({
      status     : 'error',
      message    : 'Please try somthing else',
      answer     : "Sorry, I did not understand your question. Please ask again"
    });
  } else {
    next(null, userQuery);
  }
}

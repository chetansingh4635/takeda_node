var async      = require('async');
var _          = require('lodash');
var witModel   = require('../models/witModel');

/**
* This function is use for to create response of user query based on wit response
*/
module.exports.createResponse = function createResponse(req, res, wit_res, wit_req, next) {
  if(!_.isEmpty(wit_res.entities)) {
    _.forEach(wit_res.entities, function(entityData, entity) { // Loop through all the entities from the response
    if(entityData[0].confidence > 0.50) {
        async.waterfall([
          function(next) {
            witModel.getWitResponse(entity, entityData[0].value, next);
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
      } else {
        let errorResponse = {
          status     : 'success',
          message    : 'Wit confidence level is low. Please try something different!',
          answer     : "Sorry, I did not understand your question. Please ask again",
          confidence : entityData[0].confidence,
          entity     : entity,
          value      : entityData[0].value
        };
        next(null, errorResponse);
      }
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

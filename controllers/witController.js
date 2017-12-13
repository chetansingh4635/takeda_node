'use strict'
var async        = require('async'),
_                = require('lodash'),
configs          = require('../configs.json'),
witModel         = require('../models/witModel'),
chatBotServices  = require('../services/chatBotService');
const {Wit, log} = require('node-wit');
const client     = new Wit({
  accessToken : configs.accessToken,
  logger      : new log.Logger(log.DEBUG) // optional
});

/**
* This function is use for to sent wit response for user query
*/
module.exports.witReposne = function(req, res) {
  client.message(req.body.query, {})
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((error) => {
    res.status(401).send({status : "error", message : error})
  });
}

/**
* This function is use for to sent wit cahtbot response for user query
*/
module.exports.chatBoatResponse = function(req, res) {
  async.waterfall([
    function(next) {
      witModel.isRepetitiveQuery(req, res, next); // This function is call for to  verify user query
    },
    function(response, next) {
      if(response) {
        chatBotServices.createResponse(req, res, JSON.parse(response.wit_res), JSON.parse(response.wit_req), next);
      } else {
        witResponse(req, res, next);
      }
    },
    function(queryResponse, next) {
      res.status(200).send(queryResponse);
    }
  ],
  function(err, result){
    console.log(err);
  })
}

/**
* This function is use for to create chatbot query response
*/
function witResponse(req, res, next) {
  client.message(req.body.query, {})
  .then((data) => {
    async.waterfall([
      function(next) {
        console.log(data);
        chatBotServices.createResponse(req, res, data, req.body, next);
      }
    ],
    function(err, result) {
      next(null, result);
    })
  })
  .catch((error) => {
    //witModel.trailsWitLogs(req, res, time);
    res.send({status  : "error", message : error});
  });
}

/**
* This function is use for to add data in db for chatbot training
*/
module.exports.addWitTrainingData = function(req, res) {
  async.waterfall([
    function(next) {
      witModel.isEntityExist(req, res, next);
    },
    function(entityResponse, next) {
      if(!entityResponse) {
        witModel.addEtity(req, res, next);
      } else {
        next(null, entityResponse);
      }
    },
    function(entityResponse, next) {
      witModel.addBotReplyText(entityResponse, req, res, next);
    }
  ],
  function(err, result){
    res.json({status: 'success', message: 'Entity values successfully added'})
  })
}

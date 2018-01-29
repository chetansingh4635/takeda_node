var async          = require('async');
var log4js         = require('log4js');
var logger         = log4js.getLogger();
logger.level       = 'debug';
var brandingModel  = require('../models/brandingModel');

/**
* This function is use for to retrieve branding table details
*/
module.exports.getBrandingDetails = function(req, res) {
  async.waterfall([
    function(next) {
      brandingModel.retrieveBrandingDetails(req, res, next); //Call retrieveBrandingDetails model method of brandingModel to retrieve branding details
    },
    function(brandingData, next) {
      res.status(200).json(brandingData);//Send response as branding details for user resquest
    }
  ],
  function(err, results) {
    logger.error(err);
  });
};

var async          = require('async');
var log4js         = require('log4js');
var logger         = log4js.getLogger();
logger.level       = 'debug';
var brandingModel  = require('../models/brandingModel');
var globalServices = require('../services/globalServices');

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

/**
 * This function is used to send branding details to model for saving
 */
module.exports.saveBrandingDetails = (req, res) => {
  var params = req.body;
  var action = 'brandingDetails';
  let validatorResponse = globalServices.validateParams(action, params, req, res);
  if (validatorResponse) {
    async.series([
      function (next) {
        globalServices.validateAccessToken(req, res, next);
      },
      function (next) {
        brandingModel.saveBrandingDetails(req, res, next); //Call saveBrandingDetails model method of brandingModel to save branding details
      },
      function () {
        res.status(200).json({ 'status': 'success', 'message': 'Branding Details Saved Successfully' });
      }
    ],
      function (err) {
        logger.error(err);
      });
  }
}

/**
 * This function is used to Delete branding details
 */
module.exports.deleteBrandingDetails = (req, res) => {
  var params = req.body;
  var action = 'brandingDetails';
  let validatorResponse = globalServices.validateParams(action, params, req, res);
  if (validatorResponse) {
    async.series([
      function (next) {
        globalServices.validateAccessToken(req, res, next);
      },
      function (next) {
        brandingModel.deleteBrandingDetails(req, res, next); //Call deleteBrandingDetails model method of brandingModel to delete branding details
      },
      function () {
        res.status(200).json({ 'status': 'success', 'message': 'Branding Details Deleted Successfully' });
      }
    ],
      function (err) {
        logger.error(err);
      });
  }
}

/**
 * This function is used to Update branding details
 */
module.exports.updateBrandingDetails = (req, res) => {
  var params = req.body;
  var action = 'brandingDetails';
  let validatorResponse = globalServices.validateParams(action, params, req, res);
  if (validatorResponse && (Object.keys(params).length > 1)) {
    async.waterfall([
      function (next) {
        globalServices.validateAccessToken(req, res, next);
      },
      function (next) {
        brandingModel.getBrandingDetails(req, res, next);
      },
      function (presentData, next) {
        req.presentData = presentData;
        brandingModel.updateBrandingDetails(req, res, next); //Call updateBrandingDetails model method of brandingModel to update branding details
      },
      function () {
        res.status(200).json({ 'status': 'success', 'message': 'Branding Details Updated successfully' });
      }
    ],
      function (err) {
        logger.error(err);
      });
  }else{
    res.status(401).json({ 'status': 'error', 'message': 'No Update Details Provided' });
  }
}
var async          = require('async');
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
    console.log(err);
  });
};

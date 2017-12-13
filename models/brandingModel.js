var dbConnection   = require('./dbConnection');

/**
* This model method is used for to retrive branding details
*/
module.exports.retrieveBrandingDetails = function(req, res, next) {
  dbConnection.query('SELECT primary_color,default_color,info_color,danger_color,warning_color,font_size,logo FROM tbl_branding WHERE branding_id = ?', [1], (err, brandingData) => {
    if(brandingData.length > 0) {
      next(null, brandingData[0]);
    } else {
      res.status(204).json();
    }
  });
};

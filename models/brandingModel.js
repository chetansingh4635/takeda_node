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

/**
* This model method is used for to retrive branding details
*/
module.exports.getBrandingDetails = function (req, res, next) {

  dbConnection.query('SELECT primary_color,default_color,info_color,danger_color,warning_color,font_size,logo FROM tbl_branding WHERE branding_id = ?', [req.body.branding_id], (err, brandingData) => {
    if (err) {
      res.status(401).json({ status: 'error', message: err });
    }
    if (brandingData.length > 0) {
      next(null, brandingData[0]);
    } else {
      res.status(401).json({ status: 'error', message: 'No Entry Found For the Brand Detail' });
    }
  });
};


/**
 * This modal method inserts branding details
 */
module.exports.saveBrandingDetails = (req, res, next) => {

  let dataSet = {
    organization_id: 1,
    primary_color: req.body.primary_color,
    default_color: req.body.default_color,
    info_color: req.body.info_color,
    danger_color: req.body.danger_color,
    warning_color: req.body.warning_color,
    font_size: req.body.font_size,
    logo: req.body.logo,
    added_on: req.body.added_on || null
  };

  dbConnection.query('INSERT INTO tbl_branding SET ?', dataSet, (err, response) => {
    if (err) {
      res.status(401).json({ status: 'error', message: err });
    } else {
      next();
    }
  });
};

/**
 * This modal method Delets branding details
 */
module.exports.deleteBrandingDetails = (req, res, next) => {
  dbConnection.query("DELETE FROM `tbl_branding` WHERE `branding_id`=" + req.body.branding_id, (err, response) => {
    if (err) {
      res.status(401).json({ status: 'error', message: err });
    }
    if (response.affectedRows == 0) {
      res.status(401).json({ status: 'error', message: 'Provided BrandingID not Found' });
    } else {
      next();
    }
  });
};

/**
 * This modal method Updates branding details
 */
module.exports.updateBrandingDetails = (req, res, next) => {

  let dataSet = {
    organization_id: 1,
    primary_color: req.body.primary_color || req.presentData.primary_color,
    default_color: req.body.default_color || req.presentData.default_color,
    info_color: req.body.info_color || req.presentData.info_color,
    danger_color: req.body.danger_color || req.presentData.danger_color,
    warning_color: req.body.warning_color || req.presentData.warning_color,
    font_size: req.body.font_size || req.presentData.font_size,
    logo: req.body.logo || req.presentData.logo,
    added_on: req.body.added_on || req.presentData.added_on
  };

  dbConnection.query('UPDATE tbl_branding SET ? WHERE branding_id = ' + req.body.branding_id, [dataSet], (err, response) => {
    if (err) {
      res.status(401).json({ status: 'error', message: err });
    } else {
      next();
    }
  });
};
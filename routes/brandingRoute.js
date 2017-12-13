var express          = require('express');
var router           = express.Router();
var brandingCtrl     = require('../controllers/brandingCtrl');

/**
* API end point for branding details actions
*/
router.get('/brandingDetails',   brandingCtrl.getBrandingDetails);

module.exports = router;  //Export chatbot routes

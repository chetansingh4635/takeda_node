var express          = require('express');
var router           = express.Router();
var brandingCtrl     = require('../controllers/brandingCtrl');

/**
* API end point for branding details actions
*/
router.get('/brandingDetails',          brandingCtrl.getBrandingDetails);
router.post('/saveBrandingDetails',     brandingCtrl.saveBrandingDetails);
router.delete('/deleteBrandingDetails', brandingCtrl.deleteBrandingDetails);
router.put('/updateBrandingDetails',    brandingCtrl.updateBrandingDetails);

module.exports = router;  //Export chatbot routes

var express          = require('express');
var router           = express.Router();
var validationCtrl   = require('../controllers/userValidationCtrl'); // require user validation controller

/**
* API routes for user validation actions
*/
router.post('/signup',             validationCtrl.signup);
router.post('/login',              validationCtrl.login);
router.post('/changePassword',     validationCtrl.changePassword);
router.post('/forgotPassword',     validationCtrl.forgotPassword);
router.post('/resetPassword',      validationCtrl.resetPassword);
router.post('/refreshToken',       validationCtrl.generateRefreshToken);
router.put('/addChatbotName',      validationCtrl.addChatbotName);
router.put('/activateTrial',       validationCtrl.activateTrial);
router.get('/verifyEmail',         validationCtrl.verifyEmail);
router.get('/:emailId/user/exist', validationCtrl.isUserExist);


module.exports = router; // Export user validation actions routes

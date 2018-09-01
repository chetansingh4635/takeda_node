var express       = require('express');
var router        = express.Router();
var witController = require('../controllers/witController');

/**
* API end points for chatbot actions
*/
router.post('/',         witController.chatBoatResponse);
router.post('/response', witController.witReposne);
router.post('/training', witController.addWitTrainingData);

module.exports = router; //Export chatbot routes

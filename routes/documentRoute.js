var express          = require('express');
var router           = express.Router();
var documentCtrl     = require('../controllers/documentCtrl');

/**
* API end points for documents actions
*/
router.get('/documentList',                     documentCtrl.getDocumnetList);
router.get('/:documentID/documentDetails',      documentCtrl.getDocumentDetails);
router.get('/:documentID/documentDetailsOpen',  documentCtrl.openDocDetailsHTML);

module.exports = router;  //Export chatbot routes

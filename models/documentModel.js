var dbConnection   = require('./dbConnection');

/**
* This function is used for to retrive document list
*/
module.exports.retrieveDocumentList = function(req, res, next) {
  dbConnection.query('SELECT document_id, document_label, document_simplified FROM tbl_document', (err, documentList) => {
    if(documentList.length > 0) {
      req.documentList = documentList;
      next(null, documentList);
    } else {
      res.status(204).json();
    }
  });
};

/**
* This function is used for to retrive dictionary words
*/
module.exports.retrieveDictionaryWords = function(req, res, next) {
  dbConnection.query('SELECT dictionary_word, dictionary_definition FROM tbl_document_dictionary', (err, dictionaryData) => {
    if(dictionaryData.length > 0) {
      req.dictionaryWords = dictionaryData;
      next(null, dictionaryData);
    } else {
      res.status(204).json();
    }
  });
};

/**
* This function is used for to retrive document content
*/
module.exports.retrieveDocumentContent = function(documentID, req, res, next) {
  dbConnection.query('SELECT document_label, document_description, document_simplified FROM tbl_document WHERE document_id = ?', [documentID], (err, documentDetails) => {
    if(documentDetails.length > 0) {
      req.documentContent = documentDetails[0];
      next(null, documentDetails[0]);
    } else {
      res.status(204).json();
    }
  });
};

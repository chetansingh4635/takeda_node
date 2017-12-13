var async          = require('async');
var _              = require('lodash');
var documentModel  = require('../models/documentModel');
var globalServices = require('../services/globalServices');

/**
* This function is use for to retrieve documnet list
*/
module.exports.getDocumnetList = function(req, res) {
  async.waterfall([
    function(next) {
      globalServices.validateAccessToken(req, res, next); //Validate access token
    },
    function(next) {
      documentModel.retrieveDocumentList(req, res, next); //Call retrieveDocumentList model method of documnetModel to retrieve documnet list
    },
    function(documentList, next) {
      for(let index = 0; index < documentList.length; index++) {
        documentList[index].document_simplified = documentList[index].document_simplified !== '';
      }
      res.status(200).json({status:"success", message:"Your request successfully executed", data: documentList}); //Send response as document list for user resquest
    }
  ],
  function(err, results) {
    console.log(err);
  });
};

/**
* This function is use for to retrieve documnet details but in Open form
*/
module.exports.openDocDetailsHTML = function(req, res) {
  var documentID = req.body.documentID || req.params.documentID || req.query.documentID;
  async.waterfall([
    function(next) {
      documentModel.retrieveDictionaryWords(req, res, next);
    },
    function(dictionaryWords, next) {
      documentModel.retrieveDocumentContent(documentID, req, res, next);
    },
    function(documentContent, next) {
      generateDictionaryWordsHTML(req.dictionaryWords, req, res, next);
    },
    function(dictionaryWordsHTML, next) {
      generateDocumentHTML(dictionaryWordsHTML, req.documentContent.document_description, req, res, next);
    },
    function(simplifiedDocument, next) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(simplifiedDocument);
    }
  ],
  function(err, results) {
    console.log(err);
  });
};

/**
* This function is use for to retrieve documnet details
*/
module.exports.getDocumentDetails = function(req, res) {
  var documentID = req.body.documentID || req.params.documentID || req.query.documentID;
  async.waterfall([
    function(next) {
      globalServices.validateAccessToken(req, res, next); //Validate access token
    },
    function(next) {
      documentModel.retrieveDictionaryWords(req, res, next);
    },
    function(dictionaryWords, next) {
      documentModel.retrieveDocumentContent(documentID, req, res, next);
    },
    function(documentContent, next) {
      generateDictionaryWordsHTML(req.dictionaryWords, req, res, next);
    },
    function(dictionaryWordsHTML, next) {
      generateDocumentHTML(req.dictionaryWords, req.documentContent.document_description, req, res, next);
    },
    function(documentDescription, next) {
      req.document_description = documentDescription;
      if(documentID == 1 || 2) {
        generateDocumentHTML(req.dictionaryWords, req.documentContent.document_simplified, req, res, next);
      } else {
        next();
      }
    },
    function(documentSimplified, next) {
      res.json({status : 'success', documentDescription : req.document_description, simplifiedDocument : documentSimplified});
    }
  ],
  function(err, results) {
    console.log(err);
  });
};

/**
* This function is use for to generate html for dictionary words
*/
function generateDictionaryWordsHTML(dictionaryWords, req, res, next) {
  for(var i=0; i<dictionaryWords.length; i++) {
    dictionaryWords[i].html     = '<span onclick="" class="tooltip generated_class_'+ dictionaryWords[i].dictionary_word +'"><span>' + dictionaryWords[i].dictionary_word + '<span class="arrow">&#9650;</span></span> </span>';
    dictionaryWords[i].cssClass ='.generated_class_'+ dictionaryWords[i].dictionary_word +':hover::before {\n\
    content: "' + dictionaryWords[i].dictionary_definition + '";\n\
    }\n\
    .generated_class_' + dictionaryWords[i].dictionary_word + ':hover::after{\n\
      content: "' + dictionaryWords[i].dictionary_word.charAt(0).toUpperCase()+dictionaryWords[i].dictionary_word.slice(1).toLowerCase() +'";\n\
    }';
  }
  req.dictionaryWords = dictionaryWords;
  next(null, dictionaryWords);
}

/**
* This function is use for to generate html for simplified document
*/
function generateDocumentHTML(dictionaryWordsHTML, documentString, req, res, next) {
  var documentClass = "";
  var docString = documentString;
  for(var i=0; i<dictionaryWordsHTML.length; i++) {
    if(_.includes(documentString, dictionaryWordsHTML[i].dictionary_word)) {
      documentString  = _.replace(documentString, new RegExp(' ' + dictionaryWordsHTML[i].dictionary_word + ' ', 'g'), ' ' + dictionaryWordsHTML[i].html + ' ');
      documentClass  += dictionaryWordsHTML[i].cssClass;
    }
  }

  var doc = '<html xmlns="http://www.w3.org/1999/xhtml"> \n\
<head> \n\
<meta charset="UTF-8"> \n\
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" /> \n\
    <meta name="viewport" content="width=device-width, initial-scale=1"> \n\
    <style> \n\
        @font-face {\n\
            font-family: Helvetica;\n\
            src: url(cms/Helvetica.otf);\n\
        }\n\
        body{\n\
          font-family: Helvetica;\n\
        }\n\
        body.fontSizeMedium{\n\
          font-size: 1.4rem;\n\
        }\n\
        .fontSizeLarge{\n\
          font-size: 1.8rem;\n\
        }\n\
        .fontSizeSmall{\n\
          font-size: 1.0rem;\n\
        }\n\
        .tooltip { \n\
            display: inline; \n\
            border-bottom: 1px dotted #ccc; \n\
            zcursor: help; \n\
            color: #006080; \n\
            text-align:justify; \n\
        } \n\
        .tooltip:hover::before{ \n\
            cursor:pointer; \n\
            content: ""; \n\
            position: absolute; \n\
            left: 5%; \n\
            right: 5%; \n\
            margin-top: 77px; \n\
            font-size: 1.0rem; \n\
            background-color: #4B4B4D; \n\
            color: #fff; \n\
            padding: 15px 15px; \n\
            z-index:2;\n\
            padding-top: 0px;\n\
            line-height: 1.75rem;\n\
            -webkit-box-shadow: 0px 6px 23px 0px rgba(75,75,77,0.33); \n\
            box-shadow: 0px 6px 23px 0px rgba(75,75,77,0.33);\n\
        } \n\
        .tooltip:hover::after{ \n\
            cursor:pointer; \n\
            content: "karnataka"; \n\
            position: absolute; \n\
            left: 5%; \n\
            right: 5%; \n\
            margin-top: 33px; \n\
            font-size: 1.4rem; \n\
            background-color: #4B4B4D; \n\
            color: #509BC3; \n\
            font-weight: 600;\n\
            padding: 15px 15px; \n\
            padding-botom:5px;\n\
            -webkit-box-shadow: 0px -6px 23px 0px rgba(75,75,77,0.33); \n\
            box-shadow: 0px -6px 23px 0px rgba(75,75,77,0.33);\n\
        }\n\
        .arrow{\n\
            cursor:pointer; \n\
            display: none;\n\
            font-size: 31px;\n\
            color: #4B4B4D;\n\
            min-width: 30px;\n\
            min-height: 12px;\n\
            position: absolute;\n\
            background-repeat: no-repeat;\n\
            margin-top: 10px;\n\
            margin-left: -50px;\n\
            z-index: 3;\n\
        }\n\
        .tooltip:hover .arrow{cursor:pointer;display:inline-block}\n\
        .tooltip:hover .tooltiptext {\n\
            cursor:pointer; \n\
            visibility: visible;\n\
            opacity: 1;\n\
        }\n\
        body.fontSizeLarge .tooltip:hover::after{\n\
          font-size:1.8rem;\n\
        }\n\
        body.fontSizeSmall .tooltip:hover::after{\n\
          font-size:1.0rem;\n\
        }\n\
        body.fontSizeLarge .tooltip:hover::before{\n\
          font-size:1.4rem;\n\
        }\n\
        body.fontSizeSmall .tooltip:hover::before{\n\
          font-size:0.8rem;\n\
        }\n\
        body.fontSizeLarge .arrow{\n\
          margin-top: 17px;\n\
        }\n\
        .content{   \n\
          width: 100%;\n\
        }\n\
        .content div{\n\
          margin: 50px 30px;\n\
        }\n\
        .content h3{    \n\
          width: 100%;\n\
          margin: 7px 0px;\n\
          text-align: center;\n\
        }    \n\
        .content p{    \n\
          margin: 7px 0;\n\
        }\n\
        '+documentClass+'\n\
    </style>\n\
</head>\n\
    <body ontouchstart  onclick="" class="fontSizeMedium" style="text-align:justify;">\n\
    '+ documentString+'\n\
    </body>\n\
</html>';
  next(null, doc);
}

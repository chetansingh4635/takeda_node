var async          = require('async');
var _              = require('lodash');
var log4js         = require('log4js');
var logger         = log4js.getLogger();
logger.level       = 'debug';
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
    logger.error(err);
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
    logger.error(err);
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
      req.document_details = documentContent;
      generateDictionaryWordsHTML(req.dictionaryWords, req, res, next);
    },
    function(dictionaryWordsHTML, next) {
      generateDocumentHTML(req.dictionaryWords, req.documentContent.document_description, req, res, next);
    },
    function(documentDescription, next) {
      req.document_description = documentDescription;
      if(req.document_details.document_simplified !== '') {
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
    logger.error(err);
  });
};

/**
* This function is use for to generate html for dictionary words
*/
function generateDictionaryWordsHTML(dictionaryWords, req, res, next) {
  for(var i=0; i<dictionaryWords.length; i++) {
    let dictionaryWordClass     = dictionaryWords[i].dictionary_word.split(" ");
    dictionaryWords[i].html     = `<span onclick="" class="tooltip generated_class_`+ dictionaryWords[i].dictionary_word + `"><span>` + dictionaryWords[i].dictionary_word + `<span class="arrow">&#9650;</span></span> </span>`;
    dictionaryWords[i].cssClass = `.generated_class_` + dictionaryWordClass[0] + `:hover::before {
    content: "` + dictionaryWords[i].dictionary_definition + `";
    }
    .generated_class_` + dictionaryWordClass[0] + `:hover::after{
      content: "` + dictionaryWords[i].dictionary_word.charAt(0).toUpperCase()+dictionaryWords[i].dictionary_word.slice(1).toLowerCase() + `";
    }`;
  }
  req.dictionaryWords = dictionaryWords;
  next(null, dictionaryWords);
}

/**
* This function is use for to generate html for simplified document
*/
function generateDocumentHTML(dictionaryWordsHTML, documentString, req, res, next) {
  var documentClass = "";
  for(var i=0; i<dictionaryWordsHTML.length; i++) {
    if(_.includes(documentString, dictionaryWordsHTML[i].dictionary_word)) {
      documentString  = _.replace(documentString, new RegExp(' ' + dictionaryWordsHTML[i].dictionary_word, 'g'), ' ' + dictionaryWordsHTML[i].html + ' ');
      documentClass  += dictionaryWordsHTML[i].cssClass;
    }
  }
  var doc = `<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  <meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @font-face {
            font-family: Helvetica;
            src: url(cms/Helvetica.otf);
        }
        body{
          font-family: Helvetica;
        }
        body.fontSizeMedium{
          font-size: 1.4rem;
        }
        .fontSizeLarge{
          font-size: 1.8rem;
        }
        .fontSizeSmall{
          font-size: 1.0rem;
        }
        .tooltip {
            display: inline;
            border-bottom: 1px dotted #ccc;
            zcursor: help;
            color: #006080;
            text-align:left;
        }
        .tooltip:hover::before{
            cursor:pointer;
            content: "";
            position: absolute;
            left: 5%;
            right: 5%;
            margin-top: 77px;
            font-size: 1.0rem;
            background-color: #4B4B4D;
            color: #fff;
            padding: 15px 15px;
            z-index:2;
            padding-top: 0px;
            line-henight: 1.75rem;
            -webkit-box-shadow: 0px 6px 23px 0px rgba(75,75,77,0.33);
            box-shadow: 0px 6px 23px 0px rgba(75,75,77,0.33);
        }
        .tooltip:hover::after{
            cursor:pointer;
            content: "";
            position: absolute;
            left: 5%;
            right: 5%;
            margin-top: 33px;
            font-size: 1.4rem;
            background-color: #4B4B4D;
            color: #509BC3;
            font-weight: 600;
            padding: 15px 15px;
            padding-botom:5px;
            -webkit-box-shadow: 0px -6px 23px 0px rgba(75,75,77,0.33);
            box-shadow: 0px -6px 23px 0px rgba(75,75,77,0.33);
        }
        .arrow{
            cursor:pointer;
            display: none;
            font-size: 31px;
            color: #4B4B4D;
            min-width: 30px;
            min-height: 12px;
            position: absolute;
            background-repeat: no-repeat;
            margin-top: 10px;
            margin-left: -50px;
            z-index: 3;
        }
        .tooltip:hover .arrow{cursor:pointer;display:inline-block}
        .tooltip:hover .tooltiptext {
            cursor:pointer;
            visibility: visible;
            opacity: 1;
        }
        body.fontSizeLarge .tooltip:hover::after{
          font-size:1.8rem;
        }
        body.fontSizeSmall .tooltip:hover::after{
          font-size:1.0rem;
        }
        body.fontSizeLarge .tooltip:hover::before{
          font-size:1.4rem;
        }
        body.fontSizeSmall .tooltip:hover::before{
          font-size:0.8rem;
        }
        body.fontSizeLarge .arrow{
          margin-top: 17px;
        }
        .content{
          width: 100%;
        }
        .content div{
          margin: 50px 30px;
        }
        .content .panel{
          margin: 0px 0px;
        }
        .content h3{
          width: 100%;
          margin: 7px 0px;
          text-align: center;
        }
        .content p{
          margin: 7px 0;
        }
        .content .accordion {
            margin: 1px 0;
        }
        .accordion {
                      background-color: #eee;
                      color: #444;
                      cursor: pointer;
                      padding: 5px;
                      width: 100%;
                      border: none;
                      text-align: left;
                      outline: none;
                      font-size: 15px;
                      transition: 0.4s;
                  }

                  .panel {
                      padding: 0 5px;
                      background-color: white;
                      max-height: 0;
                      overflow: hidden;
                      transition: max-height 0.2s ease-out;
                  }
        ` + documentClass+
        `</style>
    </head>
      <body ontouchstart  onclick="" class="fontSizeMedium" style="text-align:left;">`+ documentString+
    `</body>
    <script>
      var acc = document.getElementsByClassName("accordion");
      var allpanel = document.getElementsByClassName("panel");
      var i;

      for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {
              this.classList.toggle("active");
              var panel = this.nextElementSibling;
              if (panel.style.maxHeight) {
                  panel.style.maxHeight = null;
              } else {
                  for (i = 0; i < allpanel.length; i++) {
                      allpanel[i].removeAttribute("style");
                  }
                  panel.style.maxHeight = panel.scrollHeight + "px";
              }
          });
      }
  </script>
</html>`;
  next(null, doc);
}

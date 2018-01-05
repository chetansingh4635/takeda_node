var crypto         = require('crypto');
var async          = require('async');
var jwt            = require('jsonwebtoken');
var randomstring   = require('randomstring');
var dbConnection   = require('./dbConnection');

/**
* This model method is used for to get login user details
*/
module.exports.getUserDetails = function(emailId, res, next) {
  dbConnection.query('SELECT * FROM tbl_user_details WHERE email = ?', [emailId], (err, resData) => {
    if(resData && resData.length > 0 ) {
      next(null, resData[0])
    } else {
      res.status(401).json({status: 'error', message: 'Email not registered'});
    }
  });
};

/**
* This model method is used for to verify duplicate user for user signup process
*/
module.exports.verifyDuplicateUser = function (req, res, next) {
  let emailID = req.body.emailId || req.params.emailId || req.query.emailId;
  dbConnection.query('SELECT * FROM tbl_user_details WHERE email = ?', [emailID], (err, response) => {
    if(response && response.length > 0) {
      res.status(401).json({status : 'error', message : 'User already registered with this email', userExist : true});
    } else {
      next();
    }
  });
}

/**
* This model method is used for to save users details in db for user signup module
*/
module.exports.saveUserDetails = function(validatorResponse, req, res, next) {
  let salt          = crypto.randomBytes(16).toString('hex');
  let password      = crypto.pbkdf2Sync(validatorResponse.password, salt, 1000, 32, 'sha512').toString('hex');
  let userDetails = {
    user_id       : null,
    nick_name     : validatorResponse.nickName,
    email         : validatorResponse.emailId,
    user_password : password,
    salt          : salt
  };

  dbConnection.query('INSERT INTO tbl_user_details SET ?', userDetails, (err, response) => {
    if(err) {
      res.status(401).json({status : 'error', message : err});
    } else {
      next();
    }
  });
}

/**
* This model method is used for to update user old password
*/
module.exports.updatePassword = function(validatorResponse, req, res, next) {
  var randomString = randomstring.generate();
  let salt         = req.userDetails.salt;
  let userPassword = validatorResponse.newPassword || validatorResponse.resetPassword;
  let password     = crypto.pbkdf2Sync(userPassword, salt, 1000, 32, 'sha512').toString('hex');
  dbConnection.query('UPDATE tbl_user_details SET ? WHERE email = ?', [{user_password: password, emailVerificationToken: randomString}, req.userDetails.email], (err, response) => {
    if(err) {
      res.status(401).json({status:'error', message:'Failed to update password'});
    } else {
      next();
    }
  });
}

/**
* This model method is used for to verify login user is available or not
*/
module.exports.isUserExist = function(req, res, next) {
  dbConnection.query('SELECT * FROM tbl_user_details WHERE email = ?', [req.body.emailId], (err, response) => {
    if(response.length > 0) {
      req.userDetails = response[0];
      next();
    } else {
      res.status(401).json({status:'error', message:'User not registered with us'});
    }
  });
};

/**
* This model method is used for to add email verification token in user schema
*/
module.exports.addEmailVrificationToken = function(randomString, req, res, next) {
  let emailID = req.query.emailId || req.params.emailId || req.body.emailId;
  dbConnection.query('UPDATE tbl_user_details SET emailVerificationToken = ? WHERE email = ?', [randomString, emailID], (err, response) => {
    if(err) {
      res.status(401).json({status:'error', message:'Failed to add email verification token'});
    } else {
      next();
    }
  });
}

/**
* This model method is used for to add chatBot name in user schema
*/
module.exports.saveChatbotName = function(req, res, next) {
  let chatbotName = req.body.chatbotName || req.query.chatbotName || req.params.chatbotName;
  dbConnection.query('UPDATE tbl_user_details SET chatBotName = ? WHERE email = ?', [chatbotName, req.currentUser.email], (err, response) => {
    if(err) {
      res.status(401).json({status:'error', message:'Failed to add chatbot name == ' + err});
    } else {
      next();
    }
  });
}

/**
* This model method is used for to activate clinical trial for registered user
*/
module.exports.activateClinicalTrial = function(req, res, next) {
  dbConnection.query('UPDATE tbl_user_details SET  activation = ? WHERE email = ?', ['TRUE', req.currentUser.email], (err, response) => {
    if(err) {
      res.status(401).json({status:'error', message: err});
    } else {
      next();
    }
  });
}


/**
* This model method is use for update user settings details
*/
module.exports.saveSettings = function(req, res, next) {
  let settingsData = {
    nick_name   : req.body.nickName,
    chatbotName : req.body.chatbotName
  };

  dbConnection.query('UPDATE tbl_user_details SET ? WHERE email = ?', [settingsData, req.currentUser.email], (err, response) => {
    if(err) {
      res.status(401).json({status : 'error', message : err});
    } else {
      next();
    }
  });
};

/**
* This model method is use to save user profile image name
*/
module.exports.saveImageProfileName = function(profileImageName, req, res, next) {
  dbConnection.query('UPDATE tbl_user_details SET image_name = ? WHERE email = ?', [profileImageName, req.currentUser.email], (err, response) => {
    if(err) {
      res.status(401).json({status : 'error', message : err});
    } else {
      next(null, profileImageName);
    }
  });
};

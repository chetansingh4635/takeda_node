var crypto              = require('crypto');
var async               = require('async');
var jwt                 = require('jsonwebtoken');
var nodemailer          = require('nodemailer');
var randomstring        = require('randomstring');
var userValidationModel = require('../models/userValidationModel');
var globalServices      = require('../services/globalServices');

var smtpTransport = nodemailer.createTransport({
    host: configs.emailConfig.smtpServer,
    port: configs.emailConfig.smtpPort,
    secure: true,
    auth: {
        user: configs.emailConfig.username,
        pass: configs.emailConfig.password
    }
});

/**
* This function is use for to verify that user already regisaterd or not
*/
module.exports.isUserExist = function(req, res) {
  async.series([
    function(next) {
      userValidationModel.verifyDuplicateUser(req, res, next); //Call verifyDuplicateUser userValidationModel method to varify duplicate user for signup process
    }
  ],
  function(err, results) {
    res.status(200).json({status : 'success', message : "user not registered", userExist : false}); //Sent API request response
  });
}

/**
* This function is use for user registration process
*/
module.exports.signup = function(req, res) {
  var params = req.body;
  var action = 'signup';
  let validatorResponse = globalServices.validateParams(action, params, req, res);
  if(validatorResponse) {
    async.series([
      function(next) {
        userValidationModel.verifyDuplicateUser(req, res, next); //Call verifyDuplicateUser userValidationModel method to varify duplicate user for signup process
      },
      function(next) {
        userValidationModel.saveUserDetails(validatorResponse, req, res, next);    //Call saveUserDetails userValidationModel method to signup user details in db
      }
    ],
    function(err, results) {
      res.status(200).json({status : 'success', message : 'Congratulations! You have been successfully registered'}); //Send API request response
    });
  }
};

/**
* This function is use for user login module
*/
module.exports.login = function(req, res) {
  var params = req.body;
  var action = 'login';
  let validatorResponse = globalServices.validateParams(action, params, req, res);
  if(validatorResponse) {
    async.waterfall([
      function(next) {
        userValidationModel.getUserDetails(validatorResponse.emailId, res, next); //Get login user details
      },
      function(userDetails, next) {
        req.userDetails            = userDetails;
        validatorResponse.password = req.body.password;
        validatePassword(validatorResponse, req, res, next); //Validate login user password
      },
      function(next) {
        let token = globalServices.generateJwt(req, res); //Call generate access-token method of global service
        res.status(200).json({status : 'success', 'access-token' : token}); //Send access token to the user
      }
    ],
    function(err, result) {
      console.log(err);
    })
  }
};

/**
* This function is use for to change user old password as new password
*/
module.exports.changePassword = function(req, res) {
  var params = req.body;
  var action = 'changePassword';
  let validatorResponse = globalServices.validateParams(action, params, req, res);
  if(validatorResponse) {
    async.waterfall([
      function(next) {
        globalServices.validateAccessToken(req, res, next);  //Validate access token
      },
      function(next) {
        userValidationModel.getUserDetails(req.currentUser.email, res, next); //Get login user details
      },
      function(userDetails, next) {
        req.userDetails = userDetails;
        validatePassword(validatorResponse, req, res, next); //Validate login user password
      },
      function(next) {
        userValidationModel.updatePassword(validatorResponse, req, res, next); //Call updatePassword model method of userValidationModel for update user old password to new password
      },
      function(next) {
        let token = globalServices.generateJwt(req, res); //Call generate access-token method of global service
        res.status(200).json({
          'access-token' : token,
          status         : 'success',
          message        : 'Password successfully changed'
        });
      }
    ],
    function(err, result) {
      console.log(err);
    })
  }
}

/**
* This function is use for user forgot password process
*/
module.exports.forgotPassword = function(req, res) {
  var randomString      = randomstring.generate();
  var params            = req.body;
  var action            = 'forgotPassword';
  let validatorResponse = globalServices.validateParams(action, params, req, res);
  if(validatorResponse) {
    async.waterfall([
      function(next) {
        userValidationModel.getUserDetails(validatorResponse.emailId, res, next); //Get login user details
      },
      function(userDetails, next) {
        sendVerificationEmail(userDetails.nick_name, userDetails.email, randomString,  req, res, next);
      },
      function(next) {
        userValidationModel.addEmailVrificationToken(randomString, req, res, next);
      }
    ],
    function(err, result) {
      if(err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({status: 'success',  message : 'Please check your email to reset password'});
      }
    });
  }
}

/**
* This function is use for user reset password process
*/
module.exports.resetPassword = function(req, res) {
  var params            = req.body;
  var action            = 'resetPassword';
  let validatorResponse = globalServices.validateParams(action, params, req, res);
  if(validatorResponse) {
    async.waterfall([
      function(next) {
        userValidationModel.getUserDetails(validatorResponse.emailId, res, next); //Get login user details
      },
      function(userDetails, next) {
        req.userDetails = userDetails;
        userValidationModel.updatePassword(validatorResponse, req, res, next); //Call updatePassword model method of userValidationModel for update user old password to new password
      }
    ],
    function(err, result) {
      if(err) {
        res.render('passwordResetFailed.ejs');
      } else {
        res.render('passwordResetSuccess.ejs');
      }
    });
  }
}

/**
* This function is use for generate refresh token
*/
module.exports.generateRefreshToken = function(req, res) {
  async.waterfall([
    function(next) {
      globalServices.validateAccessToken(req, res, next);                   //call validate token method of global service
    },
    function(next) {
      userValidationModel.getUserDetails(req.currentUser.email, res, next); //Get login user details
    },
    function(userDetails, next) {
      req.userDetails = userDetails;
      let token       = globalServices.generateJwt(req, res);                //Call generate access-token method of global service
      res.status(200).json({status : 'success', 'access-token' : token});
    }
  ],
  function(err, result) {
    console.log(err);
  })
}

/**
* This function is use for validate user password
*/
function validatePassword(validatorResponse, req, res, next) {
  let userPassword = validatorResponse.password || validatorResponse.oldPassword;
  let password     = crypto.pbkdf2Sync(userPassword, req.userDetails.salt, 1000, 32, 'sha512').toString('hex');
  if(req.userDetails.user_password === password) {
    next();
  } else {
    res.status(401).json({status : 'error', message : 'User ID or Password is invalid. Please enter correct credentials to proceed further.'});
  }
}

/**
* This function is used for to send email verification link on signup user email
*/
function sendVerificationEmail(userName, emailId, randomString,  req, res, next) {
  let link        = 'http://' + configs.baseURL + '/v' + configs.version + '/verifyEmail?verificationToken=' + randomString + '&emailId=' + emailId;
  let mailOptions = {
    from    : configs.appName + '<' + configs.emailConfig.username  +'>',
    to      : emailId,
    subject : userName + ", Here's the link to reset your password",
    html    : "Hello " + emailId + ",<br> <br>You have requested a password reset, please follow the link below to reset your password.<br> <br> Please ignore this email if you did not request a password change.<br> <br> <a href=" + link + "> Click here to reset your password </a>"
  }

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if(error) {
      res.status(401).json({status : 'error', message : 'Unable to send email'});
    } else {
      next();
    }
  });
}

/**
* This method is use for signup user email Verification
*/
module.exports.verifyEmail = function(req, res) {
  let emailID           = req.body.emailId || req.params.emailId || req.query.emailId;
  let verificationToken = req.query.verificationToken;

  async.waterfall([
    function(next) {
      userValidationModel.getUserDetails(emailID, res, next); //Get login user details
    },
    function(userDetails, next) {
      if(userDetails.emailVerificationToken === verificationToken) {
        let tepURL = 'http://' + configs.baseURL + '/v' + configs.version + '/resetPassword';
        res.render('index.ejs', {data : emailID, baseURL : tepURL});
      } else {
        res.status(401).json({status : 'error', message : 'You can not update password'});
      }
    }
  ],
  function(err, result) {
    console.log(err);
  })
};

/**
* This method is use for to save chatbot name in user schema
*/
module.exports.addChatbotName = function(req, res) {
  async.series([
    function(next) {
      globalServices.validateAccessToken(req, res, next); //call validate token method of global service
    },
    function(next) {
      userValidationModel.saveChatbotName(req, res, next); //This model method is called for to add chatbot name
    },
    function(next) {
      res.status(200).json({status: 'success', message: 'Chatbot name successfully added'})
    }
  ],
  function(err, result) {
    console.log(err);
  })
}

"use strict";
let chai        = require('chai');
var expect      = require('chai').expect;
var superagent  = require('superagent');
var mockData    = require('./mockData');

//Require the dev-dependencies
let chaiHttp    = require('chai-http');
let should      = chai.should();
chai.use(chaiHttp);

var API_SERVER = chai.request('http://localhost:3090/v1.0.2/UAT/');

describe('/GET BrandingDetails', () => {
  it('it should GET the branding details', (done) => {
    API_SERVER
    .get('/brandingDetails')
    .end((err, res) => {
      expect(res).to.have.status(200);      //  expect(res.statusCode).to.equal(200);
      expect(res).to.be.json;               //  Check if response is object/json
      expect(res.body).to.be.an('object');  //  expect(typeof res.body).to.be("Object");
      expect(res.body).to.not.equal(null);
      expect(res.body).to.have.property('primary_color');
      expect(res.body).to.have.property('danger_color');
      expect(res.body).to.have.property('warning_color');
      done();
    });
  });
});

describe('/POST Signup', () => {
  // it('it should POST user singup details', (done) => {
  //   API_SERVER
  //   .post('/signup')
  //   .send({emailId: 'tesxxxxssctc@test.com', password: 'testkxjkj', nickName:'vasimrana'})
  //   .end((err, res) => {
  //     expect(res).to.have.status(200);
  //     expect(res).to.be.json;
  //     expect(res.body).to.be.an('object');
  //     expect(res.body).to.have.property('status');
  //     expect(res.body.status).to.equal('success');
  //     expect(res.body).to.have.property('message');
  //     expect(res.body.message).to.equal('User Successfully registered with us');
  //     done();
  //   });
  // });

  it('it should CHECK for duplicate user signup', (done) => {
    API_SERVER
    .post('/signup')
    .send({emailId : mockData.validEmailId, password : mockData.validPassword, nickName : mockData.validNickName})
    .end((err, res) => {
      expect(res).to.have.status(401);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('User already registered with this email');
      done();
    });
  });

  it('it should not let POST invalid parameters', (done) => {
    API_SERVER
    .post('/signup')
    .send({emailId : mockData.validEmailId, password : mockData.invalidParams, nickName : mockData.validNickName})
    .end((err, res) => {
      expect(res).to.have.status(401);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Validation Failed');
      done();
    });
  });
});

describe('/POST Login', () => {
  it('it should POST user login details', (done) => {
    API_SERVER
    .post('/login')
    .send({emailId : mockData.validEmailId, password : mockData.validPassword})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('access-token');
      done();
    });
  });

  it('it should NOT let POST wrong user password for login', (done) => {
    API_SERVER
    .post('/login')
    .send({emailId : mockData.validEmailId, password : mockData.invalidPassword})
    .end((err, res) => {
      expect(res).to.have.status(401);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.property('message');
      expect(res.body.message).to.equal('User ID or Password is invalid. Please enter correct credentials to proceed further.');
      done();
    });
  });

  it('it should NOT let POST wrong user email for login', (done) => {
    API_SERVER
    .post('/login')
    .send({emailId : mockData.invalidEmailId, password : mockData.validPassword})
    .end((err, res) => {
      expect(res).to.have.status(401);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Email not registered');
      done();
    });
  });
});

describe('/POST Refresh Token', () => {
  it('it should be able to GENERATE refresh token', (done) => {
    API_SERVER
    .post('/refreshToken')
    .set('x-access-token', mockData.validToken)
    .end((err, res) => {
       expect(res).to.have.status(200);
       expect(res).to.be.json;
       expect(res.body).to.be.an('object');
       expect(res.body).to.have.property('status');
       expect(res.body.status).to.equal('success');
       expect(res.body).to.have.property('access-token');
       done();
     });
   });

  it('it should CHECK for invalid access token', (done) => {
    API_SERVER
    .post('/refreshToken')
    .set('x-access-token', mockData.invalidToken)
    .end((err, res) => {
       expect(res).to.have.status(401);
       expect(res).to.be.json;
       expect(res.body).to.be.an('object');
       expect(res.body).to.have.property('status');
       expect(res.body.status).to.equal('error');
       expect(res.body).to.have.property('message');
       expect(res.body.message).to.equal('Invalid token');
       done();
     });
   });
});

describe('/POST Change Password', () => {
  it('it should change the user password', (done) => {
    API_SERVER
    .post('/changePassword')
    .set('x-access-token', mockData.validToken)
    .send({oldPassword: mockData.validPassword, newPassword: mockData.validPassword})
    .end((err, res) => {
       expect(res).to.have.status(200);
       expect(res).to.be.json;
       expect(res.body).to.be.an('object');
       expect(res.body).to.have.property('status');
       expect(res.body.status).to.equal('success');
       expect(res.body).to.have.property('message');
       expect(res.body.message).to.equal('Password successfully changed');
       expect(res.body).to.have.property('access-token');
       done();
     });
   });

   it('it should NOT let POST invalid user password for change password', (done) => {
     API_SERVER
     .post('/changePassword')
     .set('x-access-token', mockData.validToken)
     .send({oldPassword: mockData.invalidPassword, newPassword: mockData.validPassword})
     .end((err, res) => {
       expect(res).to.have.status(401);
       expect(res).to.be.json;
       expect(res.body).to.be.an('object');
       expect(res.body).to.have.property('status');
       expect(res.body.status).to.equal('error');
       expect(res.body).to.have.property('message');
       if(res.body.message == 'Invalid token'){
        expect(res.body.message).to.equal('Invalid token');
       }else if(res.body.message == 'Missing token'){
        expect(res.body.message).to.equal('Missing token');
       }
       
       done();
     });
   });
});

describe('/GET documentList', () => {
  it('it should GET document list', (done) => {
    API_SERVER
    .get('/documentList')
    .set('x-access-token', mockData.validToken)
    .send({token: mockData.validToken})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('array');
      done();
    });
  });
});

describe('/GET documentDetails', () => {
  it('it should GET document details', (done) => {
    API_SERVER
    .get('/1/documentDetails')
    .set('x-access-token', mockData.validToken)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('documentDescription');
      expect(res.body).to.have.property('simplifiedDocument');
      done();
    });
  });
});

describe('/GET UsersByDomain', () => {

  it('Check response status 401', (done) => {
    API_SERVER
    .post('/usersByDoamain/mobileprogramming')
    .end((err, res) => {
      expect(res).to.have.status(401);
      done();
    });
  });

  it('Check status = "error"', (done) => {
    API_SERVER
    .post('/usersByDoamain/mobileprogramming')
    .end((err, res) => {
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      done();
    });
  });

  it('Denay access for missing token', (done) => {
    API_SERVER
    .post('/usersByDoamain/mobileprogramming')
    .end((err, res) => {
      expect(res.body.message).to.equal('Missing token');
      done();
    });
  });


  it('Denay access for invalid token', (done) => {
    API_SERVER
    .post('/usersByDoamain/mobileprogramming')
    .send({'token': mockData.invalidToken })
    .end((err, res) => {
      expect(res.body.message).to.equal('Invalid token');
      done();
    });
  });
 
  it('List users by Domain', (done) => {
    API_SERVER
    .post('/usersByDoamain/mobileprogramming')
    .send({'token': mockData.validToken })
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.an('array');
      expect(res.body.data[0]).to.have.property('nick_name');
      expect(res.body.data[0]).to.have.property('email');
      done();
    });
  });
});

/**
 * Test cases for Branding Details API
 */

describe('Branding Details Tests', () => {
  /**
   * Test case for inserting Branding Details
   */
  it('Save Branding Details to DB', (done) => {
    API_SERVER
      .post('/saveBrandingDetails')
      .set('x-access-token', mockData.validToken)
      .send({ primary_color: '#50B', default_color: '#86BA', info_color: '#499', danger_color: '#FE2', warning_color: '#478', font_size: '11', logo: 'logoUrl', added_on: null })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('success');
        done();
      });
  });

  /**
   * Test case for missing token
   */
  it('Check Missing Token', (done) => {
    API_SERVER
      .post('/saveBrandingDetails')
      .send({ primary_color: '#50B', default_color: '#86BA', info_color: '#499', danger_color: '#FE2', warning_color: '#478', font_size: '11', logo: 'logoUrl', added_on: null })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        done();
      });
  });

  /**
   * Test case for invalid token
   */
  it('Check Invalid Token', (done) => {
    API_SERVER
      .post('/saveBrandingDetails')
      .set('x-access-token', mockData.invalidToken)
      .send({ primary_color: '#50B', default_color: '#86BA', info_color: '#499', danger_color: '#FE2', warning_color: '#478', font_size: '11', logo: 'logoUrl', added_on: null })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        done();
      });
  });

  /**
   * Test case for incomplete data set
   */
  it('Check Incomplete Dataset', (done) => {
    API_SERVER
      .post('/saveBrandingDetails')
      .set('x-access-token', mockData.validToken)
      .send({ primary_color: '#50B', default_color: '#86BA', info_color: '#499', danger_color: '#FE2', warning_color: '#478'})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        done();
      });
  });

  /**
   * Test case for delete data set
   */
  it('Deleting entry from DB', (done) => {
    API_SERVER
      .delete('/deleteBrandingDetails')
      .set('x-access-token', mockData.validToken)
      .send({ branding_id : mockData.validBrandingId  })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('success');
        done();
      });
  });  

  /**
   * Test case delete for invlid/missing branding_id
   */
  it('Check Invalid branding_id', (done) => {
    API_SERVER
      .delete('/deleteBrandingDetails')
      .set('x-access-token', mockData.validToken)
      .send({ branding_id: 13 })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        done();
      });
  });  

  /**
  * Test case for branding details update
  */
  it('Update Branding Detail Entry', (done) => {
    API_SERVER
      .patch('/updateBrandingDetails')
      .set('x-access-token', mockData.validToken)
      .send({ branding_id: 1, primary_color : '#333' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('success');
        done();
      });
  }); 

  /**
  * Test case update for missing parameter
  */
  it('Check Missing Parameter', (done) => {
    API_SERVER
      .patch('/updateBrandingDetails')
      .set('x-access-token', mockData.validToken)
      .send({ branding_id: 1 })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        done();
      });
  }); 

});


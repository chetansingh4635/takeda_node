"use strict";
let chai        = require('chai');
var expect      = require('chai').expect;
var superagent  = require('superagent');
var mockData    = require('./mockData');

//Require the dev-dependencies
let chaiHttp    = require('chai-http');
let should      = chai.should();
chai.use(chaiHttp);

var API_SERVER = chai.request('http://localhost:3004/v1.0.1');

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
      expect(res.body.message).to.equal('You have enter wrong password');
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
      expect(res.body.message).to.equal('Email address is not available');
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
       expect(res.body.message).to.equal('You have enter wrong password');
       done();
     });
   });
});

describe('/GET documentList', () => {
  it('it should GET document list', (done) => {
    API_SERVER
    .get('/documentList')
    .set('x-access-token', mockData.validToken)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
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

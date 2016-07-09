
let chai = require('chai');
let expect = chai.expect;
let utils = require('../lib');

describe('react-service-utils', () => {

  describe('#createResult', () => {
    describe('when error', () => {
      it('should not be successful', () => {
        let error    = 'Boom';
        let response = { headers: {} };
        let result   = utils.createResult(error, response);
        expect(result.success).to.be.false;
      });
      it('should have error property', () => {
        let error    = 'Boom';
        let response = { headers: {} };
        let result   = utils.createResult(error, response);
        expect(result.error).to.equal('Boom');
      });
    });
    describe('when no error', () => {
      let response;
      beforeEach(() => {
        response = { status: 200, body: 'body', headers: {} };
      });
      it('should be successful', () => {
        let result = utils.createResult(null, response);
        expect(result.success).to.be.true;
      });
      it('should have body', () => {
        let result = utils.createResult(null, response);
        expect(result.body).to.equal('body');
      });
      it('should have paging', () => {
        let result = utils.createResult(null, response);
        expect(result.hasOwnProperty('paging')).to.be.true;
      });
      it('should have validationErrors', () => {
        let result = utils.createResult(null, response);
        expect(result.hasOwnProperty('validationErrors')).to.be.true;
      });
      it('should have flash', () => {
        let result = utils.createResult(null, response);
        expect(result.hasOwnProperty('flash')).to.be.true;
      });
      it('should have result', () => {
        let result = utils.createResult(null, response);
        expect(result.hasOwnProperty('result')).to.be.true;
      });
    });
    describe('when paging', () => {
      it('should attach paging to result', () => {
        let response = { status: 200, body: [1,2,3], headers: { 'x-paging-start': 0, 'x-paging-limit': 24, 'x-paging-total': 3 }};
        let result   = utils.createResult(null, response);
        let expected = [1,2,3];
        expected.paging = { start: 0, limit: 24, total: 3 };
        expect(result.result).to.deep.equal(expected);
      });
    });
  });

  describe('#getValidationErrors', () => {
    describe('when 422 status', () => {
      it('should return the response body', () =>{
        let response = { status: 422, body: 'body' };
        let result  = utils.getValidationErrors(response);
        expect(result).to.equal('body');
      });
    });
    describe('when non-422 status', () => {
      it('should return empty object', () => {
        let response = { status: 200, body: 'body' };
        let result  = utils.getValidationErrors(response);
        expect(result).to.deep.equal({});
      });
    });
  });

  describe('#getFlash', () => {
    describe('when headers', () => {
      it('should return flash obecjt', () => {
        let response = { headers: { 'x-flash-type': 'success', 'x-flash-message': 'test flash' } };
        let result  = utils.getFlash(response);
        expect(result).to.deep.equal({ type: 'success', msg: 'test flash' });
      });
    });
    describe('when no headers', () => {
      it('should return undefined', () => {
        let response = { headers: {} };
        let result  = utils.getFlash(response);
        expect(result).to.be.undefined;
      });
    });
  });

  describe('#getPaging', () => {
    describe('when headers', () => {
      let response = { headers: { 'x-paging-start': 0, 'x-paging-limit': 24, 'x-paging-total': 123 }};
      let result  = utils.getPaging(response);
      expect(result).to.deep.equal({ start: 0, limit: 24, total: 123 });
    });
    describe('when no headers', () => {
      it('should return undefined', () => {
        let response = { headers: {} };
        let result  = utils.getPaging(response);
        expect(result).to.be.undefined;
      });
    });
  });

});
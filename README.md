# react-service-utils

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

A group of utility functions that converts XHR response (from superagent) into a standard response object. The design to from a simple inteface for Promise or async/await based services with support for various REST data (paging, flash, validation, etc) supplied through headers.

Simply import this module and use the createResult method to convert a superagent response into a uniform response that action creators can handle:
```javascript
let xhr = require('superagent');
let { createResult } = require('react-service-utils');

module.exports = {
  /**
   * Finds the users with the supplied query and paging info
   * @param {object} opts
   * @return {Promise} promise with the standard result object
   */
  getUsers(opts) {
    return new Promise((resolve) => {
      xhr
        .get('/admin/api/users')
        .query(opts)
        .type('json')
        .end((err, result) => resolve(createResult(err, result)));
    });
  }

});
```

The resulting object can then be consumed
```javascript
let dispatcher  = require('dispatcher');
let userService = require('admin/services/user-service');
let { 
  FLASH,
  USERS_LOADED
} = require('constants/action-types');

module.exports = {
  /**
   * Gets the user with the supplied paging and filtering info
   * @param {object} opts
   */
  getUsers: async function getUsers(opts) {
    let results = await userService.getUsers(opts);
    if(results.success) {
      dispatcher.dispatch({
        type: USERS_LOADED,
        payload: {
          users: results.body,
          paging: results.paging
        }
      });
    } 
    else {
      dispatcher.dispatch({
        type: FLASH,
        payload: {
          flash: {
            type: 'error',
            message: results.error
          }
        }
      });
    }    
  }
};
```

The result object contains the following properties:

* `success` - indicates if there was a 200 response
* `body` - the response body
* `paging` - paging information supplied from headers (more below)
* `flash` - flash information supplied from headers (more below)
* `error` - the error if request was not successful
* `validationErrors` - the validation errors if this was a 422 error (more below)

###Paging
Paging is automatically support via headers. Your REST endpoint should supply the following headers:

* `x-paging-start` the start index of pagination
* `x-paging-limit` the limit per page
* `x-paging-total` the total number of items in the paged set

If any of these values are supplied, they will be included in the `paging` property of the created result.

###Flash

Flash is automically supported via headers. Your REST endpoint should supply the follwoing headers:

* `x-flash-type` the type of the flash message such as success, error, or warning
* `x-flash-message` the message to flash

###Validation Errors

Validation errors are supported when the error type is a 422 error. When this occurs the validationErrors property on the the body of the response.  Your REST endpoing should return the validationErrors as the body when it is a 422 response.

##API
```javascript
createResult(err, response)
```
Creates a response object that can be used in action creators that conform to the following object typing:

```javascript
{
  success,
  body,
  paging,
  result,
  flash,
  validationErrors,
  error
}
```
The result property is the body with paging information attached.



[travis-image]: https://travis-ci.org/bmancini55/react-service-utils.svg?branch=master
[travis-url]: https://travis-ci.org/bmancini55/react-service-utils
[coveralls-image]: https://coveralls.io/repos/github/bmancini55/react-service-utils/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/bmancini55/react-service-utils?branch=master

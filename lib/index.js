
module.exports = {
  createResult,
  getValidationErrors,
  getFlash,
  getPaging
};

/**
 * Creates the result object that can be resolved
 *
 * @param {object} err
 * @param {object} response
 * @return {object} returns a uniform resolution object
 */
function createResult(error, response) {
  let success          = !error;
  let body             = getBody(response);
  let paging           = getPaging(response);
  let flash            = getFlash(response);
  let validationErrors = getValidationErrors(response);
  let statusCode       = getStatusCode(response);
  let errorMessage     = getErrorMessage(error);
  let result           = getResult(response);

  return {
    success,
    flash,
    validationErrors,
    body,
    paging,
    result,
    error,
    errorMessage,
    response,
    statusCode,
  };
}

/**
 * [getBody description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
function getBody(response) {
  if(response) {
    return response.body;
  }
}

/**
 * [getResult description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
function getResult(response) {
  if(response) {
    let result = getBody(response);
    let paging = getPaging(response);
    if(result) {
      result.paging = paging;
    }
    return result;
  }
}

/**
 * [getStatusCode description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
function getStatusCode(response) {
  if(response) {
    return response.statusCode;
  }
}

/**
 * Gets the validation errors for a 422 response
 *
 * @param {response} response
 * @return {object} map of validation errors or null
 */
function getValidationErrors(response) {
  if(response && response.status === 422) {
    return response.body;
  } else {
    return { };
  }
}

/**
 * Retrieves the flash headers from the response
 *
 * @param {res} response objct
 * @return {object} flash object
 */
function getFlash(response) {
  if(response) {
    let type = response.headers['x-flash-type'];
    let msg  = response.headers['x-flash-message'];
    if(type && msg) {
      return { type, msg };
    }
  }
}

/**
 * Retreives the paging information
 *
 * @param {res} response object
 * @return {object} paging object
 */
function getPaging(response) {
  if(response) {
    let start = parseInt(response.headers['x-paging-start']);
    let limit = parseInt(response.headers['x-paging-limit']);
    let total = parseInt(response.headers['x-paging-total']);
    if(start || limit || total) {
      return { start, limit, total };
    }
  }
}

/**
 * [getErrorMessage description]
 * @param  {[type]} error [description]
 * @return {[type]}       [description]
 */
function getErrorMessage(error) {
  if(error) {
    if(error.message) {
      return error.message;
    }
    else {
      return error;
    }
  }
}

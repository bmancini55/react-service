
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
  let success = !error;
  let body = response.body;
  let paging = getPaging(response);
  let flash  = getFlash(response);
  let validationErrors = getValidationErrors(response);
  let result = body;
  if(result && paging) {
    result.paging = paging;
  }
  return {
    success,
    flash,
    validationErrors,
    body,
    paging,
    result,
    error
  };
}

/**
 * Gets the validation errors for a 422 response
 *
 * @param {response} response
 * @return {object} map of validation errors or null
 */
function getValidationErrors(response) {
  if(response.status === 422) {
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
  let type = response.headers['x-flash-type'];
  let msg  = response.headers['x-flash-message'];
  if(type && msg) {
    return { type, msg };
  } else {
    return undefined;
  }
}

/**
 * Retreives the paging information
 *
 * @param {res} response object
 * @return {object} paging object
 */
function getPaging(response) {
  let start = parseInt(response.headers['x-paging-start']);
  let limit = parseInt(response.headers['x-paging-limit']);
  let total = parseInt(response.headers['x-paging-total']);
  if(start || limit || total) {
    return { start, limit, total };
  } else {
    return undefined;
  }
}

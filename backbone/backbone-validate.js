/**
 * Created by Nils on 6/16/2015.
 *
 * Model validator implementation using validator.js
 */

var validate = require('validate.js');


// custom error type to identify validation errors uniquely in handlers
function ValidationError(message) {
    this.name = 'ValidationError'
    this.message = message;
}
ValidationError.prototype = Object.create(TypeError.prototype);
ValidationError.prototype.constructor = ValidationError;


// validation used at runtime to ensure we always receive valid To Do serializations
// used during testing to ensure we always send valid To Do serializations
var impl = function(attrs) {
    var error = validate(attrs || this.attributes, this.constraints);
    if (error)
        return new ValidationError(error);
};

module.exports = {
    error: ValidationError,
    patch: impl
}
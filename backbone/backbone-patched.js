/**
 * Created by Nils on 6/15/2015.
 *
 * Export patched instance of Backbone library
 */

var backbone = require('backbone');
var sync = require('backbone-super-sync');
var promise = require('./backbone-promise-self');
var validate = require('./backbone-validate');


// patch backbone HTTP client to add auth
// if this was multi-user this would need to be done more intelligently
sync.editRequest = function(req) {
    req.auth(process.env.EXDO_SIMPLESTORE_USER, process.env.EXDO_SIMPLESTORE_PASSWORD)
};

// patch backbone for NodeJS compatibility
backbone.sync = sync;
// patch backbone to return fetched instances rather than response body
backbone.Model.prototype.fetch = promise.fetch;
backbone.Model.prototype.save = promise.save;
backbone.Collection.prototype.fetch = promise.fetch;
// patch backbone with validation implementation
backbone.Model.prototype.validate = validate.patch;

module.exports = backbone;
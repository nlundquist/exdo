/**
 * Created by Nils on 6/15/2015.
 *
 * Patch for Backbone to have fetch(), save() promise return the now initialized model/collection instance
 * rather than the raw response.
 *
 * Also improves error messages, describing the context of a failed model request.
 */

var q = require('q');
var backbone = require('backbone');

var model_fetch = backbone.Model.prototype.fetch;
var model_save = backbone.Model.prototype.save;
var collection_fetch = backbone.Collection.prototype.fetch;

var fetch = function() {
    var self = this;
    var d = q.defer();

    var orig;
    if (this instanceof backbone.Model)
        orig = model_fetch;
    else if (this instanceof backbone.Collection)
        orig = collection_fetch;

    // start unpatched fetch
    var ret = orig.apply(this, arguments);

    ret.then(function() {
        // return self on fetch success
        d.resolve(self);
    }, function(error) {
        if (error.status == 404) {
            error.message = 'Model not found. ID: "' + self.id + '"';
            error.stack = 'Error: ' + error.message + '\n' + error.stack;
        }

        // bubble error to wrapping promise
        d.reject(error);
    });

    return d.promise;
};

var save = function() {
    var self = this;
    var d = q.defer();

    // start unpatched save
    var error = this.validate();
    if (error) throw error;

    var ret = model_save.apply(this, arguments);

    ret.then(function() {
        // return self on fetch success
        d.resolve(self);
    }, function(error) {
        // bubble error to wrapping promise
        d.reject(error);
    });

    return d.promise;
};

module.exports = {fetch: fetch, save: save};
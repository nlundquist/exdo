/**
 * Created by Nils on 6/14/2015.
 *
 * ToDo model definition backed by SimpleStore API
 *
 */
var Backbone = require('../backbone/backbone-patched');
var validate = require('validate.js');
var extend = require('extend');
var _ = require('underscore');


var ToDo = Backbone.Model.extend({
    urlRoot: process.env.EXDO_SIMPLESTORE_URL,

    defaults: {
        // add HATEOAS links
        "links": {
            docs: [{
                name: 'todo',
                href: '/docs/todo/{rel}.html'
            }],
            'todo:crud': {href: '/todo/{?id}'}
        }
    },

    initialize: function() {
        Backbone.Model.prototype.initialize.apply(this, arguments);

        // validate when init w/ non-id attrs. no need for not-yet-valid partial models
        var attrs = _.omit(this.attributes, 'links');
        if (Object.keys(attrs).length > 1 || (Object.keys(attrs).length == 1 && Object.keys(attrs)[0] != 'id')) {
            var error = this.validate(this.attributes);
            if (error) throw error;
        }
    },

    // transform server response prior to initialization
    parse: function(body) {
        // flatten id->document nesting in SimpleStore response
        var data = body.data || {};
        extend(data, {
            id: body.id
        });
        return data;
    },

    // validation rules
    constraints: {
        "title": {
            presence: true
        },
        "complete": {
            presence: true,
            inclusion: [true, false]
        }
    }
});

// Collection for fetching lists of models
ToDo.collection = Backbone.Collection.extend({
    model: ToDo,
    url: ToDo.prototype.urlRoot,

    toJSON: function() {
        return {
            collection: Backbone.Collection.prototype.toJSON.apply(this, arguments),
            links: {
                docs: [{
                    name: 'todo',
                    href: '/docs/todo/{rel}.html'
                }],
                'todo:crud': {href: '/todo/{?id}'}
            }
        };
    }
});

module.exports = ToDo;
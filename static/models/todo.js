/**
 * Created by Nils on 6/17/2015.
 */

define(['backbone'], function(Backbone) {
    var ToDo = Backbone.Model.extend({});

    ToDo.collection = Backbone.Collection.extend({
        url: '/todo',
        model: ToDo,
        parse: function(resp) { return resp.collection; }
    });

    return ToDo;
});
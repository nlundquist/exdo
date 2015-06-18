/**
 * Created by Nils on 6/17/2015.
 *
 * The view model that is bound to the HTML document root
 */

define([
    'knockout',
    'knockback',
    'models/todo',
    'components/todo',
    'bootstrap'
], function(ko, kb, ToDo) {
    return new function() {
        this.todos = new ToDo.collection();

        this.initialize = function() {
            // Bind this object to the document root and trigger rendering
            ko.applyBindings(this);
        }
    };
});
/**
 * Created by Nils on 6/17/2015.
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
            ko.applyBindings(this);
        }
    };
});
/**
 * Created by Nils on 6/17/2015.
 */

define(['knockout', 'knockback', 'underscore'],
function(ko, kb, _) {
    var todo_view_model = kb.ViewModel.extend({
        update_todo_title: _.debounce(function() {
            this.model().save();
        }, 1000),

        toggle_complete: function() {
            this.complete(!this.complete());
            this.model().save();
        },

        remove_todo: function() {
            this.model().destroy();
        }
    });

    var component_view_model = function(params){
        this.collection = kb.collectionObservable(params.collection, {view_model: todo_view_model});
        this.new_todo_title = ko.observable("");

        // Initialize To-Do collection if not already done so
        if (!params.collection.loaded) {
            params.collection.fetch();
            params.collection.loaded = true;
        }
    };

    component_view_model.prototype.create_todo = function() {
        this.collection.collection().add({
            title: this.new_todo_title(),
            complete: false
        }).save();

        this.new_todo_title("");
    };

    ko.components.register('todo', {
        viewModel: component_view_model,
        template: {require: 'text!components/todo.html'}
    });
}
);
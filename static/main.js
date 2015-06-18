/**
 * Created by Nils on 6/17/2015.
 */

require.config({
    shim: {
        "bootstrap": { "deps": ['jquery'] }
    },
    paths: {
        jquery: 'libs/jquery/dist/jquery',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        knockback: 'libs/knockback/knockback',
        knockout: 'libs/knockout/dist/knockout',
        bootstrap:'libs/bootstrap/dist/js/bootstrap',
        text: 'libs/text/text'
    }
});

require (['app'], function(app) {
    return app.initialize();
});
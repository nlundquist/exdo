/**
 * Created by Nils on 6/14/2015.
 */

// App API Root
exdo = {
    get: function(req, res, next) {
        res.json({
            message: 'exdo API Version 0.0.1',
            links: {
                docs: [{
                    name: 'todo',
                    href: '/docs/todo/{rel}.html'
                }],
                'todo:crud': {href: '/todo/{?id}'}
            }
        });
    }
};

module.exports = exdo;
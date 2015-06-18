# To-Do CRUD API
Simple API resources to fetch and manipulate To-Do item records.



# To-Do Item [/todo/{id}]
This resource represents a single To-Do item instance identified by its *id*.

+ Model (application/json)
    ```
    {
        "id": "6af6b790-1532-11e5-a968-2945267eddcc"
        "title": "Get Milk"
        "complete": false
        "links": {
            docs: [{
                name: 'todo',
                href: '/docs/todo/{rel}.html'
            }],
            'todo:crud': {href: '/todo/{?id}'}
        }
    }
    ```

+ Parameters
    + id: `8c07aed0-1532-11e5-a968-2945267eddcc` String required - The UUID of the To-Do item.

## Retrieve To-Do Item [GET]
Retrieve a To-Do item by *id*.

+ Response 200
    [To-Do Item][]

## Replace To-Do Item [PUT]
Replace the record of a To-Do item referenced by *id*.

+ Request
    ```
    {
        "title": "Get Milk"
        "complete": true
    }
    ```

+ Response 204

## Delete To-Do Item [DELETE]
Delete the record of a To-Do item referencd by *id*.

+ Response 204



# To-Do Item List [/todo/]
This resource represents the complete set of To-Do items.

+ Model (application/json)
    ```
    {
        "collection": [
                {
                    "id": "8c07aed0-1532-11e5-a968-2945267eddcc"
                    "title": "Get Eggs"
                    "complete": false
                    "links": {
                        docs: [{
                            name: 'todo',
                            href: '/docs/todo/{rel}.html'
                        }],
                        'todo:crud': {href: '/todo/{?id}'}
                    }
                },
                {
                    "id": "6af6b790-1532-11e5-a968-2945267eddcc"
                    "title": "Get Milk"
                    "complete": false
                    "links": {
                        docs: [{
                            name: 'todo',
                            href: '/docs/todo/{rel}.html'
                        }],
                        'todo:crud': {href: '/todo/{?id}'}
                    }
                }
            }
        ],
        "links": {
            docs: [{
                name: 'todo',
                href: '/docs/todo/{rel}.html'
            }],
            'todo:crud': {href: '/todo/{?id}'}
        }
    }
    ```

## Retrieve All Items [GET]
Retrieve all To-Do items.

+ Response 200
    [To-Do Item List][]

## Add New Item [POST]
Create new To-Do item record.

+ Request (application/json)
    ```
    {
        "title": "Get Milk"
        "complete": false
    }
    ```

+ Response 200
    [To-Do Item][]
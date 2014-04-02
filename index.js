var Hapi = require('hapi');
var Joi = require('joi');

var database = require('./db/database.json');

var server = new Hapi.Server(3000, 'localhost');

// TODO refactor this config into separate modules
var helloConfig = {
    handler: function (request, reply) {
        var names = request.params.name.split('/');

        reply({
            first: names[0],
            last: names[1],
            mood: request.query.mood,
            age: request.query.age
        });
    },
    validate: {
        path: {
            name: Joi.string().min(8).max(100)
        },
        query: {
            mood: Joi.string().valid(['neutral', 'happy', 'sad']).default('neutral'),
            age: Joi.number().integer().min(13).max(100)
        }
    }
};

server.route({
    path: '/',
    method: 'GET',

    handler: function (request, reply) {
        reply('Hello Hapi world');
    }
});

server.route({
    path: '/hello/{name*2}',
    method: 'GET',
    config: helloConfig
});

server.route({
    path: '/users',
    method: 'GET',
    handler: function (request, reply) {
        reply(Object.keys(database));
    }
});

// NOTE Prevents the server from starting during testing
if (!module.parent) {
    server.start(function () {
        console.log('Hapi server started @ ' + server.info.uri);
    });
}

module.exports = server;

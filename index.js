var Hapi = require('hapi');
var Joi = require('joi');

var database = require('./db/database.json');

var server = new Hapi.Server(3000, 'localhost', {
    cache: {
        // IMPORTANT ensure redis is running to cache server data
        // use catbox-memory to develop locally with caching turned on
        engine: 'catbox-redis',
        options: {
            host: 'localhost',
            partition: 'HapiGettingStarted',
            password: 'mypassword'
        }
    },
    views: {
        engines: {
            jade: 'jade'
        },
        path: './views'
    }
});

// NOTE server methods for general purpose
server.method('getColor', function (name, next) {
    var colors = ['red', 'green', 'indigo', 'violet', 'orange', 'teal'];
    var color = colors[Math.floor(Math.random() * colors.length)];

    next(null, color);
}, {
    cache: {
        expiresIn: 30000
    }
});

// TODO refactor this config into separate modules
var helloConfig = {
    handler: function (request, reply) {
        var names = request.params.name.split('/');

        server.methods.getColor(request.params.name, function (err, color) {
            reply.view('hello', {
                first: names[0],
                last: names[1],
                mood: request.query.mood,
                age: request.query.age,
                color: color
            });
        });
    },
    validate: {
        path: {
            name: Joi.string().min(8).max(100)
        },
        query: {
            mood: Joi.string().valid(['boring', 'grumpy', 'happy']).default('boring'),
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

// Serve static assets
server.route({
    path: '/static/{path*}',
    method: 'GET',
    handler: {
        directory: {
            path: './public',
            listing: false,
            index: false
        }
    }
});

// NOTE Prevents the server from starting during testing
if (!module.parent) {
    server.pack.require(['lout', './plugins/example'], function (err) {
        if (err) throw err;
        server.start(function () {
            console.log('Hapi server started @ ' + server.info.uri);
        });
    });
}

module.exports = server;

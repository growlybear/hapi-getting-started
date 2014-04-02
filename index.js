var Hapi = require('hapi');
var Joi = require('joi');

var server = new Hapi.Server(3000, 'localhost');

// TODO refactor this config into separate modules
var helloConfig = {
    handler: function (request, reply) {
        console.log(request);

        var names = request.params.name.split('/');

        reply({
            first: names[0],
            last: names[1],
            mood: request.query.mood
        });
    },
    validate: {
        path: {
            name: Joi.string().min(8).max(100)
        },
        query: {
            mood: Joi.string().valid(['neutral', 'happy', 'sad']).default('neutral')
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
})

server.start(function () {
    console.log('Hapi server started @ ' + server.info.uri);
});

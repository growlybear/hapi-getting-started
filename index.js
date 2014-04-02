var Hapi = require('hapi');

var server = new Hapi.Server(3000, 'localhost');

server.start(function () {
    console.log('Hapi server started @ ' + server.info.uri);
});

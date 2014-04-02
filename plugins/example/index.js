var internals = {};

exports.register = function (plugin, options, next) {

    plugin.route({
        path: '/my/plugin',
        method: 'GET',
        handler: function (request, reply) {
            reply('This is a reply from a route defined in my plugin!');
        }
    });

    next();
};

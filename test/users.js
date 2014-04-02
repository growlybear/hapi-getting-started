var Lab = require('lab');
var server = require('../');

// NOTE for more familiar sytax, use:
//     var describe = Lab.experiment;
//     var it = Lab.test;

Lab.experiment('Users', function () {

    Lab.test('/users lists usernames on the network', function (done) {
        var options = {
            method: 'GET',
            url: '/users'
        };

        server.inject(options, function (response) {
            var result = response.result;

            // NOTE Lab.expect refers to the chai assertion module
            Lab.expect(response.statusCode).to.equal(200);
            Lab.expect(result).to.be.instanceof(Array);
            Lab.expect(result).to.have.length(5);

            done();
        })
    });
});

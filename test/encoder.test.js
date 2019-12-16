var expect = require('chai').expect,
    urlEncoder = require('../index.js'),
    sdk = require('postman-collection');

describe('encoder', function () {
    describe('toNodeUrl() from PostmanUrl', function () {
        var list = require('./fixtures/postman-url-to-node-url');

        list.forEach(function (url) {
            it(url.title, function () {
                var postmanUrl = new sdk.Url(url.in),
                    nodeUrl = urlEncoder.toNodeUrl(postmanUrl);

                expect(nodeUrl).to.eql(url.out);
            });
        });
    });

    describe('toNodeUrl() from string URL', function () {
        var list = require('./fixtures/string-url-to-node-url');

        list.forEach(function (url) {
            it(url.title, function () {
                var postmanUrl = new sdk.Url(url.in),
                    nodeUrl = urlEncoder.toNodeUrl(postmanUrl);

                expect(nodeUrl).to.eql(url.out);
            });
        });
    });
});

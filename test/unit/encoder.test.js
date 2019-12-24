var expect = require('chai').expect,
    urlEncoder = require('../../index.js'),
    sdk = require('postman-collection');

describe('encoder', function () {
    describe('encodeAuth()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encoder.encodeAuth({})).to.eql('');
            expect(urlEncoder.encoder.encodeAuth(null)).to.eql('');
        });

        it('should encode unicode auth param', function () {
            expect(urlEncoder.encoder.encodeAuth('𝌆й你ス')).to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should not encode already encoded auth param', function () {
            expect(urlEncoder.encoder.encodeAuth('%25')).to.eql('%25');
        });
    });

    describe('encodeHost()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encoder.encodeHost({})).to.eql('');
            expect(urlEncoder.encoder.encodeHost(null)).to.eql('');
        });

        it('should accept host as an array', function () {
            expect(urlEncoder.encoder.encodeHost(['www', 'postman', 'com'])).to.eql('www.postman.com');
        });

        it('should encode unicode host', function () {
            expect(urlEncoder.encoder.encodeHost('邮差.com')).to.eql('xn--nstq34i.com');
        });

        it('should not encode already encoded unicode host', function () {
            expect(urlEncoder.encoder.encodeHost('xn--nstq34i.com')).to.eql('xn--nstq34i.com');
        });
    });

    describe('encodePath()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encoder.encodePath({})).to.eql('');
            expect(urlEncoder.encoder.encodePath(null)).to.eql('');
        });

        it('should accept path as an array', function () {
            expect(urlEncoder.encoder.encodePath(['foo', 'bar', 'baz'])).to.eql('foo/bar/baz');
        });

        it('should encode special characters in path', function () {
            expect(urlEncoder.encoder.encodePath('/ /"/#/</>/?/`/{/}')).to.eql('/%20/%22/%23/%3C/%3E/%3F/%60/%7B/%7D');
        });

        it('should encode unicode characters in path', function () {
            expect(urlEncoder.encoder.encodePath('/𝌆/й/你/ス')).to.eql('/%F0%9D%8C%86/%D0%B9/%E4%BD%A0/%E3%82%B9');
        });

        it('should not encode already encoded characters in path', function () {
            expect(urlEncoder.encoder.encodePath('/%25')).to.eql('/%25');
        });
    });

    // @todo this API is no longer exposed
    describe.skip('encodeQueryParam()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encodeQueryParam(null)).to.eql('');
            expect(urlEncoder.encodeQueryParam(undefined)).to.eql('');
        });

        it('should accept string argument', function () {
            expect(urlEncoder.encodeQueryParam('邮差')).to.eql('%E9%82%AE%E5%B7%AE');
        });

        it('should properly handle param without key', function () {
            expect(urlEncoder.encodeQueryParam({ value: 'bar' })).to.eql('=bar');
        });

        it('should properly handle param without value', function () {
            expect(urlEncoder.encodeQueryParam({ key: 'foo' })).to.eql('foo=');
        });

        it('should properly handle param without key and value', function () {
            expect(urlEncoder.encodeQueryParam({})).to.eql('');
        });

        it('should encode special characters in key', function () {
            expect(urlEncoder.encodeQueryParam({ key: ' "#\'<>', value: 'bar' })).to.eql('%20%22%23%27%3C%3E=bar');
        });

        it('should encode special characters in value', function () {
            expect(urlEncoder.encodeQueryParam({ key: 'foo', value: ' "#\'<>' })).to.eql('foo=%20%22%23%27%3C%3E');
        });

        it('should encode unicode characters in key', function () {
            expect(urlEncoder.encodeQueryParam({ key: '𝌆й你ス', value: 'bar' }))
                .to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9=bar');
        });

        it('should encode unicode characters in value', function () {
            expect(urlEncoder.encodeQueryParam({ key: 'foo', value: '𝌆й你ス' }))
                .to.eql('foo=%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should not encode already encoded characters', function () {
            expect(urlEncoder.encodeQueryParam({ key: '%25', value: '%25' })).to.eql('%25=%25');
        });
    });

    describe('encodeQueryParams()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encoder.encodeQueryParams(null)).to.eql('');
            expect(urlEncoder.encoder.encodeQueryParams(undefined)).to.eql('');
            expect(urlEncoder.encoder.encodeQueryParams('foo')).to.eql('');
        });

        it('should accept array of param objects in the argument', function () {
            var params = [
                { key: 'q1', value: 'v1' },
                { key: 'q2', value: 'v2' }
            ];

            expect(urlEncoder.encoder.encodeQueryParams(params)).to.eql('q1=v1&q2=v2');
        });

        it('should accept params object in the argument', function () {
            var params = {
                q1: 'v1',
                q2: 'v2'
            };

            expect(urlEncoder.encoder.encodeQueryParams(params)).to.eql('q1=v1&q2=v2');
        });

        it('should properly handle multiple values for a key in params object', function () {
            var params = {
                q1: ['v1_1', 'v1_2'],
                q2: 'v2'
            };

            expect(urlEncoder.encoder.encodeQueryParams(params)).to.eql('q1=v1_1&q1=v1_2&q2=v2');
        });

        it('should exclude disabled params when second argument is true', function () {
            var params = [
                { key: 'q1', value: 'v1', disabled: true },
                { key: 'q2', value: 'v2' }
            ];

            expect(urlEncoder.encoder.encodeQueryParams(params, true)).to.eql('q2=v2');
        });

        it('should not exclude disabled params when second argument is false', function () {
            var params = [
                { key: 'q1', value: 'v1', disabled: true },
                { key: 'q2', value: 'v2' }
            ];

            expect(urlEncoder.encoder.encodeQueryParams(params, false)).to.eql('q1=v1&q2=v2');
        });
    });

    describe('stringifyUrlencodedBody()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.stringifyUrlencodedBody(null)).to.eql('');
            expect(urlEncoder.stringifyUrlencodedBody(undefined)).to.eql('');
            expect(urlEncoder.stringifyUrlencodedBody('foo')).to.eql('');
        });

        it('should properly stringify given body', function () {
            var urlencodedBody = {
                    foo: 'bar',
                    alpha: ['beta', 'gama']
                },
                stringifiedBody = 'foo=bar&alpha=beta&alpha=gama';

            expect(urlEncoder.stringifyUrlencodedBody(urlencodedBody)).to.eql(stringifiedBody);
        });

        it('should encode characters: `!\'()*`', function () {
            var urlencodedBody = {
                    extraChars: '!\'()*'
                },
                stringifiedBody = 'extraChars=%21%27%28%29%2A';

            expect(urlEncoder.stringifyUrlencodedBody(urlencodedBody)).to.eql(stringifiedBody);
        });
    });

    describe('encodeHash()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encoder.encodeHash(null)).to.eql('');
            expect(urlEncoder.encoder.encodeHash(undefined)).to.eql('');
            expect(urlEncoder.encoder.encodeHash({})).to.eql('');
        });

        it('should encode unicode characters in given hash', function () {
            expect(urlEncoder.encoder.encodeHash('𝌆й你ス')).to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should encode special characters in given hash', function () {
            expect(urlEncoder.encoder.encodeHash(' "<>`')).to.eql('%20%22%3C%3E%60');
        });

        it('should not encode already encoded characters', function () {
            expect(urlEncoder.encoder.encodeHash('%25')).to.eql('%25');
        });
    });

    describe('toNodeUrl()', function () {
        it('should return empty url for invalid argument', function () {
            var emptyUrl = {
                protocol: null,
                slashes: null,
                auth: null,
                host: null,
                port: null,
                hostname: null,
                hash: null,
                search: null,
                query: null,
                pathname: null,
                path: null,
                href: null
            };

            expect(urlEncoder.toNodeUrl(null)).to.eql(emptyUrl);
            expect(urlEncoder.toNodeUrl(undefined)).to.eql(emptyUrl);
            expect(urlEncoder.toNodeUrl([])).to.eql(emptyUrl);
            expect(urlEncoder.toNodeUrl({})).to.eql(emptyUrl);
        });

        describe('from PostmanUrl', function () {
            var list = require('../fixtures/postman-url-to-node-url');

            list.forEach(function (url) {
                it(url.title, function () {
                    var postmanUrl = new sdk.Url(url.in),
                        nodeUrl = urlEncoder.toNodeUrl(postmanUrl);

                    expect(nodeUrl).to.eql(url.out);
                });
            });
        });

        describe('from string URL', function () {
            var list = require('../fixtures/string-url-to-node-url');

            list.forEach(function (url) {
                it(url.title, function () {
                    var nodeUrl = urlEncoder.toNodeUrl(url.in);

                    expect(nodeUrl).to.eql(url.out);
                });
            });
        });
    });
});

var sdk = require('postman-collection'),
    expect = require('chai').expect,

    encoder = require('../../encoder'),
    urlEncoder = require('../../index');

describe('encoder', function () {
    describe('encodeUserInfo()', function () {
        it('should return empty string for invalid argument', function () {
            expect(encoder.encodeUserInfo({})).to.eql('');
            expect(encoder.encodeUserInfo(null)).to.eql('');
        });

        it('should encode unicode auth param', function () {
            expect(encoder.encodeUserInfo('𝌆й你ス')).to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should not encode already encoded auth param', function () {
            expect(encoder.encodeUserInfo('%25')).to.eql('%25');
        });
    });

    describe('encodeHost()', function () {
        it('should return empty string for invalid argument', function () {
            expect(encoder.encodeHost({})).to.eql('');
            expect(encoder.encodeHost(null)).to.eql('');
        });

        it('should accept host as an array', function () {
            expect(encoder.encodeHost(['www', 'postman', 'com'])).to.eql('www.postman.com');
        });

        it('should encode unicode host', function () {
            expect(encoder.encodeHost('邮差.com')).to.eql('xn--nstq34i.com');
        });

        it('should not encode already encoded unicode host', function () {
            expect(encoder.encodeHost('xn--nstq34i.com')).to.eql('xn--nstq34i.com');
        });
    });

    describe('encodePath()', function () {
        it('should return empty string for invalid argument', function () {
            expect(encoder.encodePath({})).to.eql('');
            expect(encoder.encodePath(null)).to.eql('');
        });

        it('should accept path as an array', function () {
            expect(encoder.encodePath(['foo', 'bar', 'baz'])).to.eql('foo/bar/baz');
        });

        it('should encode special characters in path', function () {
            expect(encoder.encodePath('/ /"/#/</>/?/`/{/}')).to.eql('/%20/%22/%23/%3C/%3E/%3F/%60/%7B/%7D');
        });

        it('should encode unicode characters in path', function () {
            expect(encoder.encodePath('/𝌆/й/你/ス')).to.eql('/%F0%9D%8C%86/%D0%B9/%E4%BD%A0/%E3%82%B9');
        });

        it('should not encode already encoded characters in path', function () {
            expect(encoder.encodePath('/%25')).to.eql('/%25');
        });
    });

    // @todo this API is no longer exposed
    describe('encodeQueryParam()', function () {
        it('should return empty string for invalid argument', function () {
            expect(encoder.encodeQueryParam(null)).to.eql('');
            expect(encoder.encodeQueryParam(undefined)).to.eql('');
        });

        it('should accept string argument', function () {
            expect(encoder.encodeQueryParam('邮差')).to.eql('%E9%82%AE%E5%B7%AE');
        });

        it('should properly handle param without key', function () {
            expect(encoder.encodeQueryParam({ value: 'bar' })).to.eql('=bar');
        });

        it('should properly handle param without value', function () {
            expect(encoder.encodeQueryParam({ key: 'foo' })).to.eql('foo=');
        });

        it('should properly handle param without key and value', function () {
            expect(encoder.encodeQueryParam({})).to.eql('');
        });

        it('should encode special characters in key', function () {
            expect(encoder.encodeQueryParam({ key: ' "#\'<>', value: 'bar' })).to.eql('%20%22%23%27%3C%3E=bar');
        });

        it('should encode special characters in value', function () {
            expect(encoder.encodeQueryParam({ key: 'foo', value: ' "#\'<>' })).to.eql('foo=%20%22%23%27%3C%3E');
        });

        it('should encode unicode characters in key', function () {
            expect(encoder.encodeQueryParam({ key: '𝌆й你ス', value: 'bar' }))
                .to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9=bar');
        });

        it('should encode unicode characters in value', function () {
            expect(encoder.encodeQueryParam({ key: 'foo', value: '𝌆й你ス' }))
                .to.eql('foo=%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should not encode already encoded characters', function () {
            expect(encoder.encodeQueryParam({ key: '%25', value: '%25' })).to.eql('%25=%25');
        });
    });

    describe('encodeQueryParams()', function () {
        it('should return empty string for invalid argument', function () {
            expect(encoder.encodeQueryParams(null)).to.eql('');
            expect(encoder.encodeQueryParams(undefined)).to.eql('');
            expect(encoder.encodeQueryParams('foo')).to.eql('');
        });

        it('should accept array of param objects in the argument', function () {
            var params = [
                { key: 'q1', value: 'v1' },
                { key: 'q2', value: 'v2' }
            ];

            expect(encoder.encodeQueryParams(params)).to.eql('q1=v1&q2=v2');
        });

        it('should accept params object in the argument', function () {
            var params = {
                q1: 'v1',
                q2: 'v2'
            };

            expect(encoder.encodeQueryParams(params)).to.eql('q1=v1&q2=v2');
        });

        it('should properly handle multiple values for a key in params object', function () {
            var params = {
                q1: ['v1_1', 'v1_2'],
                q2: 'v2'
            };

            expect(encoder.encodeQueryParams(params)).to.eql('q1=v1_1&q1=v1_2&q2=v2');
        });

        it('should exclude disabled params by default', function () {
            var params = [
                { key: 'q1', value: 'v1', disabled: true },
                { key: 'q2', value: 'v2' }
            ];

            expect(encoder.encodeQueryParams(params)).to.eql('q2=v2');
        });
    });

    describe('encodeQueryString()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encodeQueryString(null)).to.eql('');
            expect(urlEncoder.encodeQueryString(undefined)).to.eql('');
            expect(urlEncoder.encodeQueryString('foo')).to.eql('');
        });

        it('should properly stringify given body', function () {
            var urlencodedBody = {
                    foo: 'bar',
                    alpha: ['beta', 'gama']
                },
                stringifiedBody = 'foo=bar&alpha=beta&alpha=gama';

            expect(urlEncoder.encodeQueryString(urlencodedBody)).to.eql(stringifiedBody);
        });

        it('should encode characters: `!\'()*`', function () {
            var urlencodedBody = {
                    extraChars: '!\'()*'
                },
                stringifiedBody = 'extraChars=%21%27%28%29%2A';

            expect(urlEncoder.encodeQueryString(urlencodedBody)).to.eql(stringifiedBody);
        });
    });

    describe('encodeFragment()', function () {
        it('should return empty string for invalid argument', function () {
            expect(encoder.encodeFragment(null)).to.eql('');
            expect(encoder.encodeFragment(undefined)).to.eql('');
            expect(encoder.encodeFragment({})).to.eql('');
        });

        it('should encode unicode characters in given hash', function () {
            expect(encoder.encodeFragment('𝌆й你ス')).to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should encode special characters in given hash', function () {
            expect(encoder.encodeFragment(' "<>`')).to.eql('%20%22%3C%3E%60');
        });

        it('should not encode already encoded characters', function () {
            expect(encoder.encodeFragment('%25')).to.eql('%25');
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
                href: ''
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

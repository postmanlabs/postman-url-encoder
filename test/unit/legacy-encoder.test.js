var sdk = require('postman-collection'),
    expect = require('chai').expect,

    urlEncoder = require('../../index').toLegacyNodeUrl;

describe('Legacy encoder', function () {
    describe('Url Encoding fix of node\'s bug', function () {
        describe('Encode', function () {
            it('%', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?charwithPercent=%foo').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?charwithPercent=%25foo');
            });

            it('( and )', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?a=foo(a)').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?a=foo%28a%29');
            });

            it('Space', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?a=foo bar').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?a=foo%20bar');
            });

            it('multibyte character "𝌆"', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?multibyte=𝌆').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?multibyte=%F0%9D%8C%86');
            });

            it('Russian charcters "обязательный"', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?a=обязательный').href;

                // eslint-disable-next-line max-len
                expect(encodedUrl).to.equal('http://foo.bar.com/?a=%D0%BE%D0%B1%D1%8F%D0%B7%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9');
            });

            it('Chinese charcters "你好"', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?a=你好').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?a=%E4%BD%A0%E5%A5%BD');
            });

            it('Japanese charcters "ハローポストマン"', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?a=ハローポストマン').href;

                // eslint-disable-next-line max-len
                expect(encodedUrl).to.equal('http://foo.bar.com/?a=%E3%83%8F%E3%83%AD%E3%83%BC%E3%83%9D%E3%82%B9%E3%83%88%E3%83%9E%E3%83%B3');
            });

            it('Partial Russian charcters "Hello Почтальон"', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?a=Hello Почтальон').href;

                expect(encodedUrl)
                    .to.equal('http://foo.bar.com/?a=Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD');
            });
        });

        describe('Do not encode', function () {

            it('/, &, =, :, ?, +', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?a=b&c=d&e=f+g').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?a=b&c=d&e=f+g');
            });

            it('[ and ]', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?a[0]=foo&a[1]=bar').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?a[0]=foo&a[1]=bar');
            });

            it('pre encoded text( must avoid double encoding) - "email=foo%2Bbar%40domain.com"', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?email=foo%2Bbar%40domain.com').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?email=foo%2Bbar%40domain.com');
            });

            it('pre-encoded multibyte character - "multibyte=%F0%9D%8C%86"', function () {
                var encodedUrl = urlEncoder('http://foo.bar.com/?multibyte=%F0%9D%8C%86').href;
                expect(encodedUrl).to.equal('http://foo.bar.com/?multibyte=%F0%9D%8C%86');
            });

            // eslint-disable-next-line max-len
            it('pre-encoded russian text - "a=Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD"', function () {
                // eslint-disable-next-line max-len
                var encodedUrl = urlEncoder('http://foo.bar.com/?a=Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD').href;

                expect(encodedUrl)
                    .to.equal('http://foo.bar.com/?a=Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD');
            });
        });
    });

    describe('toLegacyNodeUrl()', function () {
        it('should convert postman URL to string properly', function () {
            var url = new sdk.Url({
                    auth: '',
                    protocol: 'http',
                    port: '3000',
                    path: '/foo/bar',
                    hash: 'postman',
                    host: 'www.getpostman.com',
                    query: {
                        foo1: 'bar1',
                        foo2: 'bar2'
                    }
                }),
                expectedResult = {
                    protocol: 'http:',
                    slashes: true,
                    auth: null,
                    host: 'www.getpostman.com:3000',
                    port: '3000',
                    hostname: 'www.getpostman.com',
                    hash: '#postman',
                    search: '?foo1=bar1&foo2=bar2',
                    query: 'foo1=bar1&foo2=bar2',
                    pathname: '/foo/bar',
                    path: '/foo/bar?foo1=bar1&foo2=bar2',
                    href: 'http://www.getpostman.com:3000/foo/bar?foo1=bar1&foo2=bar2#postman'
                },
                nodeUrl = urlEncoder(url.toString());

            expect(nodeUrl).to.include(expectedResult);
        });

        it('should encode properly while converting to node URL', function () {
            var url = new sdk.Url({
                    auth: '',
                    protocol: 'http',
                    port: '3000',
                    path: '/foo/bar',
                    hash: 'postman',
                    host: 'www.郵便配達員.com',
                    query: {
                        foo1: '差',
                        foo2: 'bar2'
                    }
                }),
                expectedResult = {
                    protocol: 'http:',
                    slashes: true,
                    auth: null,
                    host: 'www.xn--wtqy8jqx5dmsazn.com:3000',
                    port: '3000',
                    hostname: 'www.xn--wtqy8jqx5dmsazn.com',
                    hash: '#postman',
                    search: '?foo1=%E5%B7%AE&foo2=bar2',
                    query: 'foo1=%E5%B7%AE&foo2=bar2',
                    pathname: '/foo/bar',
                    path: '/foo/bar?foo1=%E5%B7%AE&foo2=bar2',
                    href: 'http://www.xn--wtqy8jqx5dmsazn.com:3000/foo/bar?foo1=%E5%B7%AE&foo2=bar2#postman'
                },
                nodeUrl = urlEncoder(url.toString());

            expect(nodeUrl).to.include(expectedResult);
        });
    });
});

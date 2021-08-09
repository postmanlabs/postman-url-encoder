const expect = require('chai').expect,

    parser = require('../../../parser'),

    defaultObject = {
        protocol: undefined,
        auth: undefined,
        host: undefined,
        port: undefined,
        path: undefined,
        query: undefined,
        hash: undefined
    };

describe('parser', function () {
    describe('.parse', function () {
        it('should return parsed URL object', function () {
            expect(parser.parse('protocol://user:password@host.com:port/p/a/t/h?q=query#hash')).to.eql({
                raw: 'protocol://user:password@host.com:port/p/a/t/h?q=query#hash',
                protocol: 'protocol',
                auth: ['user', 'password'],
                host: ['host', 'com'],
                port: 'port',
                path: ['p', 'a', 't', 'h'],
                query: ['q=query'],
                hash: 'hash'
            });
        });

        it('should retain variables in parsed URL', function () {
            expect(parser.parse('http://{{hostname}}.com/{{path}}#')).to.eql({
                raw: 'http://{{hostname}}.com/{{path}}#',
                protocol: 'http',
                auth: undefined,
                host: ['{{hostname}}', 'com'],
                port: undefined,
                path: ['{{path}}'],
                query: undefined,
                hash: ''
            });
        });

        it('should parse with variables having reserved characters', function () {
            expect(parser.parse('protocol://{{user}}:{{p@ssw?rd}}@{{host.name}}.com:{{#port}}/p/a/t/h?q=query#'))
                .to.eql({
                    raw: 'protocol://{{user}}:{{p@ssw?rd}}@{{host.name}}.com:{{#port}}/p/a/t/h?q=query#',
                    protocol: 'protocol',
                    auth: ['{{user}}', '{{p@ssw?rd}}'],
                    host: ['{{host.name}}', 'com'],
                    port: '{{#port}}',
                    path: ['p', 'a', 't', 'h'],
                    query: ['q=query'],
                    hash: ''
                });
        });

        it('should trim leading whitespace characters', function () {
            expect(parser.parse('    http://postman.com'))
                .to.eql({
                    raw: 'http://postman.com',
                    protocol: 'http',
                    auth: undefined,
                    host: ['postman', 'com'],
                    port: undefined,
                    path: undefined,
                    query: undefined,
                    hash: undefined
                });
        });

        it('should not trim trailing whitespace characters', function () {
            expect(parser.parse('http://postman.com    '))
                .to.eql({
                    raw: 'http://postman.com    ',
                    protocol: 'http',
                    auth: undefined,
                    host: ['postman', 'com    '],
                    port: undefined,
                    path: undefined,
                    query: undefined,
                    hash: undefined
                });
        });

        it('should retain empty segments', function () {
            expect(parser.parse('://:@:/?#')).to.eql({
                raw: '://:@:/?#',
                protocol: '',
                auth: ['', ''],
                host: undefined,
                port: '',
                path: [''],
                query: [''],
                hash: ''
            });
        });

        it('should handle newlines in every segment', function () {
            expect(parser.parse('http://\n:\r@\r.\n:\n/\n/\n?\n=\r#\n')).to.eql({
                raw: 'http://\n:\r@\r.\n:\n/\n/\n?\n=\r#\n',
                protocol: 'http',
                auth: ['\n', '\r'],
                host: ['\r', '\n'],
                port: '\n',
                path: ['\n', '\n'],
                query: ['\n=\r'],
                hash: '\n'
            });
        });

        it('should handle \\ in path name', function () {
            expect(parser.parse('http://localhost\\foo\\bar')).to.deep.include({
                raw: 'http://localhost\\foo\\bar',
                protocol: 'http',
                host: ['localhost'],
                path: ['foo', 'bar']
            });
        });

        it('should distinguish between hostname and path #security', function () {
            expect(parser.parse('http://postman.com:80\\@evil.com/#foo\\bar')).to.deep.include({
                raw: 'http://postman.com:80\\@evil.com/#foo\\bar',
                protocol: 'http',
                host: ['postman', 'com'],
                port: '80',
                path: ['@evil.com', ''],
                hash: 'foo\\bar'
            });
        });

        it('should handle local IPv6 address', function () {
            expect(parser.parse('http://[::1]/path')).to.deep.include({
                raw: 'http://[::1]/path',
                host: ['[::1]'],
                path: ['path']
            });
        });

        it('should handle IPv6 address with port', function () {
            expect(parser.parse('http://[::1]:8080')).to.deep.include({
                raw: 'http://[::1]:8080',
                protocol: 'http',
                host: ['[::1]'],
                port: '8080'
            });
        });

        it('should handle IPv6 address without port', function () {
            expect(parser.parse('http://[1080:0:0:0:8:800:200C:417A]/foo/bar?q=z')).to.deep.include({
                raw: 'http://[1080:0:0:0:8:800:200C:417A]/foo/bar?q=z',
                protocol: 'http',
                host: ['[1080:0:0:0:8:800:200C:417A]'],
                path: ['foo', 'bar'],
                query: ['q=z']
            });
        });

        it('should handle IPv6 with auth', function () {
            expect(parser.parse('http://user:password@[1080:0:0:0:8:800:200C:417A]:8080')).to.deep.include({
                raw: 'http://user:password@[1080:0:0:0:8:800:200C:417A]:8080',
                protocol: 'http',
                host: ['[1080:0:0:0:8:800:200C:417A]'],
                auth: ['user', 'password'],
                port: '8080'
            });
        });

        it('should trim whitespace on the left', function () {
            expect(parser.parse(' \n\t\rhttp://localhost/path\n/name\n ')).to.deep.include({
                raw: 'http://localhost/path\n/name\n ',
                protocol: 'http',
                host: ['localhost'],
                path: ['path\n', 'name\n ']
            });
        });

        it('should handle multiple : in auth', function () {
            expect(parser.parse('http://user:p:a:s:s@localhost')).to.deep.include({
                raw: 'http://user:p:a:s:s@localhost',
                protocol: 'http',
                host: ['localhost'],
                auth: ['user', 'p:a:s:s']
            });
        });

        it('should handle multiple @ in auth', function () {
            expect(parser.parse('http://us@r:p@ssword@localhost')).to.deep.include({
                raw: 'http://us@r:p@ssword@localhost',
                protocol: 'http',
                host: ['localhost'],
                auth: ['us@r', 'p@ssword']
            });
        });

        it('should handle multiple ???', function () {
            expect(parser.parse('http://localhost/p/q=foo@bar???&hl=en&src=api&x=2&y=2&z=3&s=')).to.deep.include({
                raw: 'http://localhost/p/q=foo@bar???&hl=en&src=api&x=2&y=2&z=3&s=',
                protocol: 'http',
                host: ['localhost'],
                path: ['p', 'q=foo@bar'],
                query: ['??', 'hl=en', 'src=api', 'x=2', 'y=2', 'z=3', 's=']
            });
        });

        it('should handle multiple &&&', function () {
            expect(parser.parse('http://localhost?foo=bar&&&bar=baz')).to.deep.include({
                raw: 'http://localhost?foo=bar&&&bar=baz',
                protocol: 'http',
                host: ['localhost'],
                query: ['foo=bar', '', '', 'bar=baz']
            });
        });

        it('should handle auth without password', function () {
            expect(parser.parse('http://root@localhost')).to.deep.include({
                raw: 'http://root@localhost',
                protocol: 'http',
                host: ['localhost'],
                auth: ['root']
            });
        });

        it('should handle protocol with backslashes', function () {
            expect(parser.parse('http:\\\\localhost')).to.deep.include({
                raw: 'http:\\\\localhost',
                protocol: 'http',
                host: ['localhost']
            });
        });

        it('should handle extra slashes after protocol', function () {
            expect(parser.parse('http:////localhost/foo')).to.deep.include({
                raw: 'http:////localhost/foo',
                protocol: 'http',
                host: ['localhost'],
                path: ['foo']
            });
        });

        it('should handle extra backslashes after protocol', function () {
            expect(parser.parse('http:\\\\\\\\localhost')).to.deep.include({
                raw: 'http:\\\\\\\\localhost',
                protocol: 'http',
                host: ['localhost'],
                path: undefined
            });
        });

        it('should handle file://host/foo', function () {
            expect(parser.parse('file://host/foo')).to.deep.include({
                raw: 'file://host/foo',
                protocol: 'file',
                host: ['host'],
                path: ['foo']
            });
        });

        it('should handle file:///foo/bar', function () {
            expect(parser.parse('file:///foo/bar')).to.deep.include({
                raw: 'file:///foo/bar',
                protocol: 'file',
                host: undefined,
                path: ['foo', 'bar']
            });
        });

        it('should handle file://///foo/bar', function () {
            expect(parser.parse('file://///foo/bar')).to.deep.include({
                raw: 'file://///foo/bar',
                protocol: 'file',
                host: undefined,
                path: ['foo', 'bar']
            });
        });

        it('should return default object for empty string input', function () {
            expect(parser.parse('')).to.deep.include(defaultObject);
            expect(parser.parse('  ')).to.deep.include(defaultObject);
        });

        it('should return default object on invalid input types', function () {
            expect(parser.parse()).to.deep.include(defaultObject);
            expect(parser.parse(null)).to.deep.include(defaultObject);
            expect(parser.parse(1234)).to.deep.include(defaultObject);
            expect(parser.parse({})).to.deep.include(defaultObject);
        });
    });
});

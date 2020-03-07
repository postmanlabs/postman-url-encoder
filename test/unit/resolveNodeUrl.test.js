var expect = require('chai').expect,
    encoder = require('../../'),
    toNodeUrl = encoder.toNodeUrl,
    resolve = encoder.resolveNodeUrl;

describe('.resolveNodeUrl', function () {
    describe('base URL sanity', function () {
        it('should return relative URL when base is not like Node url object', function () {
            var relative = '/foo/bar';

            expect(resolve(undefined, relative)).to.eql(relative);
            expect(resolve(null, relative)).to.eql(relative);
            expect(resolve({}, relative)).to.eql(relative);
            expect(resolve(true, relative)).to.eql(relative);
            expect(resolve([], relative)).to.eql(relative);
            expect(resolve(123, relative)).to.eql(relative);
        });

        it('should return relative URL when base doesn\'t have required properties', function () {
            var relative = '/foo/bar',

                // base URL without protocol, auth, host, pathname, and search properties
                base = {
                    href: 'http://postman.com'
                };

            expect(resolve(base, relative)).to.eql(relative);
        });

        it('should accept string URL as base', function () {
            expect(resolve('http://postman.com', '/foo')).to.eql('http://postman.com/foo');
        });

        it('should accept Node url like object as base', function () {
            expect(resolve(toNodeUrl('http://postman.com'), '/foo')).to.eql('http://postman.com/foo');
            expect(resolve(toNodeUrl(null), '/foo')).to.eql('/foo');
        });
    });

    describe('relative URL sanity', function () {
        it('should return base when relative URL is not string', function () {
            var base = 'http://usr:pswd@postman.com/foo?q=v';

            expect(resolve(base, undefined)).to.eql(base);
            expect(resolve(base, null)).to.eql(base);
            expect(resolve(base, 123)).to.eql(base);
            expect(resolve(base, {})).to.eql(base);
            expect(resolve(base, [])).to.eql(base);
        });

        it('should return base without hash when relative URL is empty', function () {
            expect(resolve('http://postman.com/', '')).to.eql('http://postman.com/');
            expect(resolve('http://postman.com/foo#hash', '')).to.eql('http://postman.com/foo');
            expect(resolve('http://[::1]:8080/', '')).to.eql('http://[::1]:8080/');

            expect(resolve('http://usr:pswd@postman.com/foo?q=v#hash', '')).to
                .eql('http://usr:pswd@postman.com/foo?q=v');
        });

        it('should return base when relative URL is empty', function () {
            var base = 'http://usr:pswd@postman.com/foo?q=v';

            expect(resolve(base, '')).to.eql(base);
        });
    });

    describe('protocol relative URL', function () {
        it('should return relative URL with base protocol', function () {
            expect(resolve('http://postman.com', '//example.com/path?q=v')).to
                .eql('http://example.com/path?q=v');

            expect(resolve('http://postman.com', '//usr:pswd@example.com/path?q=v')).to
                .eql('http://usr:pswd@example.com/path?q=v');

            expect(resolve('foo://postman.com', '//example.com/path?q=v')).to
                .eql('foo://example.com/path?q=v');

            expect(resolve('https://postman.com/path?q=v#hash_1', '//foo?q=v#hash_2')).to
                .eql('https://foo?q=v#hash_2');

            expect(resolve('https://', '//foo?q=v#hash_2')).to
                .eql('https://foo?q=v#hash_2');
        });

        it('should add default protocol if base is string without protocol', function () {
            expect(resolve('postman.com', '//example.com')).to
                .eql('http://example.com');
        });

        it('should handle relative URL starting with `\\\\`', function () {
            expect(resolve('http://postman.com', '\\\\example.com/path?q=v')).to
                .eql('http:\\\\example.com/path?q=v');
        });

        it('should keep `\\` in path as it is', function () {
            expect(resolve('http://postman.com', '//example.com\\foo\\bar?q=v')).to
                .eql('http://example.com\\foo\\bar?q=v');
        });

        it('should keep `\\` in query as it is', function () {
            expect(resolve('http://postman.com', '//example.com/path?q=foo\\bar')).to
                .eql('http://example.com/path?q=foo\\bar');
        });

        it('should properly handle IPv6 host', function () {
            expect(resolve('https://postman.com', '//[::1]/foo')).to
                .eql('https://[::1]/foo');

            expect(resolve('https://postman.com', '//[::1]:8080/foo')).to
                .eql('https://[::1]:8080/foo');
        });
    });

    describe('path relative URL', function () {
        it('should handle relative URL starting with `/`', function () {
            expect(resolve('http://postman.com/foo/bar', '/alpha/beta?q2=v2#hash_2')).to
                .eql('http://postman.com/alpha/beta?q2=v2#hash_2');

            expect(resolve('http://postman.com/foo/bar/', '/alpha/beta?q2=v2#hash_2')).to
                .eql('http://postman.com/alpha/beta?q2=v2#hash_2');

            expect(resolve('http://usr:pswd@postman.com/foo/bar?q1=v1#hash_1', '/alpha/beta?q2=v2#hash_2')).to
                .eql('http://usr:pswd@postman.com/alpha/beta?q2=v2#hash_2');
        });

        it('should handle relative URL starting with `\\`', function () {
            expect(resolve('http://postman.com/foo/bar', '\\alpha/beta?q2=v2#hash_2')).to
                .eql('http://postman.com\\alpha/beta?q2=v2#hash_2');

            expect(resolve('http://postman.com/foo/bar/', '\\alpha/beta?q2=v2#hash_2')).to
                .eql('http://postman.com\\alpha/beta?q2=v2#hash_2');

            expect(resolve('http://usr:pswd@postman.com/foo/bar?q1=v1#hash_1', '\\alpha/beta?q2=v2#hash_2')).to
                .eql('http://usr:pswd@postman.com\\alpha/beta?q2=v2#hash_2');
        });

        it('should keep `\\` in path as it is', function () {
            expect(resolve('http://postman.com/foo/bar', '\\alpha\\beta')).to
                .eql('http://postman.com\\alpha\\beta');
        });

        it('should keep `\\` in query as it is', function () {
            expect(resolve('http://postman.com/foo/bar', '/alpha/beta?q=foo\\bar')).to
                .eql('http://postman.com/alpha/beta?q=foo\\bar');
        });

        it('should properly handle IPv6 host', function () {
            expect(resolve('http://[::1]/foo/bar', '/alpha/beta')).to
                .eql('http://[::1]/alpha/beta');

            expect(resolve('http://[::1]:8080/foo/bar', '/alpha/beta')).to
                .eql('http://[::1]:8080/alpha/beta');
        });
    });

    describe('relative URL starting with ?', function () {
        it('should handle relative URL with only query', function () {
            expect(resolve('http://postman.com', '?q2=v2')).to
                .eql('http://postman.com/?q2=v2');

            expect(resolve('http://postman.com/path?q1=v1#hash', '?q2=v2')).to
                .eql('http://postman.com/path?q2=v2');

            expect(resolve('http://usr:pswd@postman.com/path?q1=v1#hash', '?q2=v2')).to
                .eql('http://usr:pswd@postman.com/path?q2=v2');
        });

        it('should handle relative URL with query and hash', function () {
            expect(resolve('http://postman.com', '?q2=v2#hash_2')).to
                .eql('http://postman.com/?q2=v2#hash_2');

            expect(resolve('http://postman.com/path?q1=v1#hash_1', '?q2=v2#hash_2')).to
                .eql('http://postman.com/path?q2=v2#hash_2');

            expect(resolve('http://usr:pswd@postman.com/path?q1=v1#hash_1', '?q2=v2#hash_2')).to
                .eql('http://usr:pswd@postman.com/path?q2=v2#hash_2');
        });

        it('should convert `\\` in base path to `/`', function () {
            expect(resolve('http://postman.com\\foo\\bar', '?q=v')).to
                .eql('http://postman.com/foo/bar?q=v');
        });

        it('should keep `\\` in query as it is', function () {
            expect(resolve('http://postman.com/foo/bar', '?q=alpha\\beta')).to
                .eql('http://postman.com/foo/bar?q=alpha\\beta');
        });

        it('should properly handle IPv6 host', function () {
            expect(resolve('http://[::1]/foo/bar', '?q=v')).to
                .eql('http://[::1]/foo/bar?q=v');

            expect(resolve('http://[::1]:8080/foo/bar', '?q=v')).to
                .eql('http://[::1]:8080/foo/bar?q=v');
        });
    });

    describe('relative URL starting with #', function () {
        it('should handle relative URL with only hash', function () {
            expect(resolve('http://postman.com', '#hash_2')).to
                .eql('http://postman.com/#hash_2');

            expect(resolve('http://postman.com/path?q1=v1#hash_1', '#hash_2')).to
                .eql('http://postman.com/path?q1=v1#hash_2');

            expect(resolve('http://usr:pswd@postman.com/path?q1=v1#hash_1', '#hash_2')).to
                .eql('http://usr:pswd@postman.com/path?q1=v1#hash_2');
        });

        it('should convert `\\` in base path to `/`', function () {
            expect(resolve('http://postman.com\\foo\\bar', '#hash')).to
                .eql('http://postman.com/foo/bar#hash');
        });

        it('should keep `\\` in hash as it is', function () {
            expect(resolve('http://postman.com/foo/bar', '#alpha\\beta')).to
                .eql('http://postman.com/foo/bar#alpha\\beta');
        });

        it('should properly handle IPv6 host', function () {
            expect(resolve('http://[::1]/foo/bar', '#hash')).to
                .eql('http://[::1]/foo/bar#hash');

            expect(resolve('http://[::1]:8080/foo/bar', '#hash')).to
                .eql('http://[::1]:8080/foo/bar#hash');
        });
    });

    describe('full URL as relative URL', function () {
        it('should return relative URL as it is', function () {
            expect(resolve('http://postman.com', 'https://example.com')).to
                .eql('https://example.com');

            expect(resolve('http://postman.com', 'https://usr:pswd@example.com/path?q=v#hash')).to
                .eql('https://usr:pswd@example.com/path?q=v#hash');

            // eslint-disable-next-line max-len
            expect(resolve('http://usr_1:pswd_1@postman.com/path_1?q1=v1#hash1', 'https://usr_2:pswd_2@example.com/path_2?q2=v2#hash_2')).to
                .eql('https://usr_2:pswd_2@example.com/path_2?q2=v2#hash_2');
        });

        it('should handle relative URL with `:\\\\` protocol separator', function () {
            expect(resolve('http://postman.com', 'https:\\\\example.com')).to
                .eql('https:\\\\example.com');

            expect(resolve('http://postman.com', 'https:\\\\usr:pswd@example.com/path?q=v#hash')).to
                .eql('https:\\\\usr:pswd@example.com/path?q=v#hash');

            // eslint-disable-next-line max-len
            expect(resolve('http://usr_1:pswd_1@postman.com/path_1?q1=v1#hash1', 'https:\\\\usr_2:pswd_2@example.com/path_2?q2=v2#hash_2')).to
                .eql('https:\\\\usr_2:pswd_2@example.com/path_2?q2=v2#hash_2');
        });

        it('should keep `\\` in path as it is', function () {
            expect(resolve('http://postman.com/foo', 'https://example.com\\alpha\\beta')).to
                .eql('https://example.com\\alpha\\beta');
        });

        it('should keep `\\` in query as it is', function () {
            expect(resolve('http://postman.com/foo/bar', 'https://example.com/alpha?q=beta\\gamma')).to
                .eql('https://example.com/alpha?q=beta\\gamma');
        });

        it('should properly handle IPv6 host', function () {
            expect(resolve('http://postman.com', 'https://[::1]')).to
                .eql('https://[::1]');

            expect(resolve('http://postman.com', 'https://[::1]:8080')).to
                .eql('https://[::1]:8080');
        });
    });

    describe('relative URL free from path', function () {
        it('should remove last path segment from base', function () {
            expect(resolve('http://postman.com/foo/bar', 'baz')).to
                .eql('http://postman.com/foo/baz');

            expect(resolve('http://postman.com/foo/bar?q=v#hash', 'baz')).to
                .eql('http://postman.com/foo/baz');

            expect(resolve('http://postman.com/foo/bar?q1=v1#hash_1', 'alpha/beta?q2=v2#hash_2')).to
                .eql('http://postman.com/foo/alpha/beta?q2=v2#hash_2');

            expect(resolve('http://usr:pswd@postman.com/foo/bar?q1=v1#hash_1', 'alpha/beta?q2=v2#hash_2')).to
                .eql('http://usr:pswd@postman.com/foo/alpha/beta?q2=v2#hash_2');

            expect(resolve('http://postman.com', 'http://')).to
                .eql('http://postman.com/http://');

            expect(resolve('http://postman.com', 'http:\\\\')).to
                .eql('http://postman.com/http:\\\\');

            expect(resolve('http://postman.com', 'foo?q=://bar')).to
                .eql('http://postman.com/foo?q=://bar');
        });

        it('should not remove last path segment from base ending with `/`', function () {
            expect(resolve('http://postman.com/foo/bar/', 'baz')).to
                .eql('http://postman.com/foo/bar/baz');

            expect(resolve('http://postman.com/foo/bar/?q=v#hash', 'baz')).to
                .eql('http://postman.com/foo/bar/baz');

            expect(resolve('http://postman.com/foo/bar/?q1=v1#hash_1', 'alpha/beta?q2=v2#hash_2')).to
                .eql('http://postman.com/foo/bar/alpha/beta?q2=v2#hash_2');

            expect(resolve('http://usr:pswd@postman.com/foo/bar/?q1=v1#hash_1', 'alpha/beta?q2=v2#hash_2')).to
                .eql('http://usr:pswd@postman.com/foo/bar/alpha/beta?q2=v2#hash_2');
        });

        it('should not remove last path segment from base ending with `\\`', function () {
            expect(resolve('http://postman.com/foo/bar\\', 'baz')).to
                .eql('http://postman.com/foo/bar/baz');

            expect(resolve('http://postman.com/foo/bar\\?q=v#hash', 'baz')).to
                .eql('http://postman.com/foo/bar/baz');

            expect(resolve('http://postman.com/foo/bar\\?q1=v1#hash_1', 'alpha/beta?q2=v2#hash_2')).to
                .eql('http://postman.com/foo/bar/alpha/beta?q2=v2#hash_2');

            expect(resolve('http://usr:pswd@postman.com/foo/bar\\?q1=v1#hash_1', 'alpha/beta?q2=v2#hash_2')).to
                .eql('http://usr:pswd@postman.com/foo/bar/alpha/beta?q2=v2#hash_2');
        });

        it('should keep `\\` in relative path as it is', function () {
            expect(resolve('http://postman.com/foo/bar', 'alpha\\beta')).to
                .eql('http://postman.com/foo/alpha\\beta');
        });

        it('should convert `\\` in base path to `/`', function () {
            expect(resolve('http://postman.com\\foo\\bar', 'alpha')).to
                .eql('http://postman.com/foo/alpha');
        });

        it('should keep `\\` in query as it is', function () {
            expect(resolve('http://postman.com/foo/bar', 'baz?q=beta\\gamma')).to
                .eql('http://postman.com/foo/baz?q=beta\\gamma');
        });

        it('should properly handle IPv6 host', function () {
            expect(resolve('http://[::1]/foo/bar', 'baz')).to
                .eql('http://[::1]/foo/baz');

            expect(resolve('http://[::1]:8080/foo/bar', 'baz')).to
                .eql('http://[::1]:8080/foo/baz');
        });
    });
});

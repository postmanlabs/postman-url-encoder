const expect = require('chai').expect,
    PostmanUrl = require('postman-collection').Url,

    toNodeUrl = require('../../').toNodeUrl;

describe('.toNodeUrl', function () {
    it('should accept url string', function () {
        expect(toNodeUrl('cooper@郵便屋さん.com:399/foo&bar/{baz}?q=("foo")#`hash`'))
            .to.eql({
                protocol: 'http:',
                slashes: true,
                auth: 'cooper',
                host: 'xn--48jwgn17gdel797d.com:399',
                port: '399',
                hostname: 'xn--48jwgn17gdel797d.com',
                hash: '#%60hash%60',
                search: '?q=(%22foo%22)',
                query: 'q=(%22foo%22)',
                pathname: '/foo&bar/%7Bbaz%7D',
                path: '/foo&bar/%7Bbaz%7D?q=(%22foo%22)',
                href: 'http://cooper@xn--48jwgn17gdel797d.com:399/foo&bar/%7Bbaz%7D?q=(%22foo%22)#%60hash%60'
            });
    });

    it('should accept url as PostmanUrl', function () {
        var url = new PostmanUrl({
            host: '127.1',
            protocol: 'postman',
            path: ['f00', '#', 'bär'],
            query: [{ key: 'q', value: '(A & B)' }],
            auth: {
                password: '🔒'
            }
        });

        expect(toNodeUrl(url)).to.eql({
            protocol: 'postman:',
            slashes: false,
            auth: ':%F0%9F%94%92',
            host: '127.0.0.1',
            port: null,
            hostname: '127.0.0.1',
            hash: null,
            search: '?q=(A%20%26%20B)',
            query: 'q=(A%20%26%20B)',
            pathname: '/f00/%23/b%C3%A4r',
            path: '/f00/%23/b%C3%A4r?q=(A%20%26%20B)',
            href: 'postman://:%F0%9F%94%92@127.0.0.1/f00/%23/b%C3%A4r?q=(A%20%26%20B)'
        });
    });

    it('should return empty url object on invalid input types', function () {
        var defaultUrl = {
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

        expect(toNodeUrl()).to.eql(defaultUrl);
        expect(toNodeUrl(null)).to.eql(defaultUrl);
        expect(toNodeUrl(undefined)).to.eql(defaultUrl);
        expect(toNodeUrl(true)).to.eql(defaultUrl);
        expect(toNodeUrl({})).to.eql(defaultUrl);
        expect(toNodeUrl([])).to.eql(defaultUrl);
        expect(toNodeUrl(Function)).to.eql(defaultUrl);
        expect(toNodeUrl({ host: 'example.com' })).to.eql(defaultUrl);
    });
});

module.exports = [
    // empty relative URL
    {
        base: 'http://postman-echo.com',
        relative: '',
        resolved: 'http://postman-echo.com/'
    },
    {
        base: 'http://postman-echo.com/',
        relative: '',
        resolved: 'http://postman-echo.com/'
    },
    {
        base: 'http://postman-echo.com:8080/',
        relative: '',
        resolved: 'http://postman-echo.com:8080/'
    },
    {
        base: 'http://[::1]/',
        relative: '',
        resolved: 'http://[::1]/'
    },
    {
        base: 'http://[::1]:8080/',
        relative: '',
        resolved: 'http://[::1]:8080/'
    },
    {
        base: 'http://postman-echo.com/path',
        relative: '',
        resolved: 'http://postman-echo.com/path'
    },
    {
        base: 'http://postman-echo.com/path/',
        relative: '',
        resolved: 'http://postman-echo.com/path/'
    },
    {
        base: 'http://postman-echo.com\\path\\foo',
        relative: '',
        resolved: 'http://postman-echo.com/path/foo'
    },
    {
        base: 'http://postman-echo.com#hash',
        relative: '',
        resolved: 'http://postman-echo.com/'
    },
    {
        base: 'http://postman-echo.com/path#hash',
        relative: '',
        resolved: 'http://postman-echo.com/path'
    },
    {
        base: 'http://postman-echo.com/path?foo=bar#hash',
        relative: '',
        resolved: 'http://postman-echo.com/path?foo=bar'
    },
    {
        base: 'http://postman-echo.com/path?foo=bar\\baz',
        relative: '',
        resolved: 'http://postman-echo.com/path?foo=bar\\baz'
    },
    {
        base: 'http://usr:pswd@postman-echo.com/path?foo=bar#hash',
        relative: '',
        resolved: 'http://usr:pswd@postman-echo.com/path?foo=bar'
    },

    // relative URL with protocol
    {
        base: 'http://postman.com',
        relative: 'http://',
        resolved: 'http://'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com',
        resolved: 'http://postman-echo.com'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com:8080',
        resolved: 'http://postman-echo.com:8080'
    },
    {
        base: 'http://postman.com',
        relative: 'http://[::1]',
        resolved: 'http://[::1]'
    },
    {
        base: 'http://postman.com',
        relative: 'http://[::1]:8080',
        resolved: 'http://[::1]:8080'
    },
    {
        base: 'http://postman.com',
        relative: 'https://postman-echo.com',
        resolved: 'https://postman-echo.com'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com/path',
        resolved: 'http://postman-echo.com/path'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com/path/foo/bar',
        resolved: 'http://postman-echo.com/path/foo/bar'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com\\path\\foo\\bar',
        resolved: 'http://postman-echo.com/path/foo/bar'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com/path?foo=bar',
        resolved: 'http://postman-echo.com/path?foo=bar'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com/path?foo=bar\\baz',
        resolved: 'http://postman-echo.com/path?foo=bar\\baz'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com/path#hash',
        resolved: 'http://postman-echo.com/path#hash'
    },
    {
        base: 'http://postman.com',
        relative: 'http://postman-echo.com/path?foo=bar#hash',
        resolved: 'http://postman-echo.com/path?foo=bar#hash'
    },
    {
        base: 'http://postman.com',
        relative: 'http://usr:pswd@postman-echo.com/path?foo=bar#hash',
        resolved: 'http://usr:pswd@postman-echo.com/path?foo=bar#hash'
    },

    // protocol-relative url
    {
        base: 'http://postman.com',
        relative: '//postman-echo.com',
        resolved: 'http://postman-echo.com'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//postman-echo.com/path/bar',
        resolved: 'http://postman-echo.com/path/bar'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//postman-echo.com\\path/bar',
        resolved: 'http://postman-echo.com/path/bar'
    },
    {
        base: 'http://postman.com/foo',
        relative: '\\\\postman-echo.com\\path/bar',
        resolved: 'http://postman-echo.com/path/bar'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//foo/bar',
        resolved: 'http://foo/bar'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//foo/bar?q=v',
        resolved: 'http://foo/bar?q=v'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//foo/bar?q=v#hash',
        resolved: 'http://foo/bar?q=v#hash'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//foo/bar#hash',
        resolved: 'http://foo/bar#hash'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//usr:pswd@foo/bar?q=v#hash',
        resolved: 'http://usr:pswd@foo/bar?q=v#hash'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//[::1]/foo/bar?q=v#hash',
        resolved: 'http://[::1]/foo/bar?q=v#hash'
    },
    {
        base: 'http://postman.com/foo',
        relative: '//[::1]:8080/foo/bar?q=v#hash',
        resolved: 'http://[::1]:8080/foo/bar?q=v#hash'
    },

    // root-relative URL
    {
        base: 'http://postman.com/path/alpha',
        relative: '/foo/bar',
        resolved: 'http://postman.com/foo/bar'
    },
    {
        base: 'http://[::1]/path/alpha',
        relative: '/foo/bar',
        resolved: 'http://[::1]/foo/bar'
    },
    {
        base: 'http://[::1]:8080/path/alpha',
        relative: '/foo/bar',
        resolved: 'http://[::1]:8080/foo/bar'
    },
    {
        base: 'http://postman.com/path/alpha/',
        relative: '/foo/bar',
        resolved: 'http://postman.com/foo/bar'
    },
    {
        base: 'http://postman.com/path/alpha#hash',
        relative: '/foo/bar',
        resolved: 'http://postman.com/foo/bar'
    },
    {
        base: 'http://postman.com/path/alpha?q=v',
        relative: '/foo/bar',
        resolved: 'http://postman.com/foo/bar'
    },
    {
        base: 'http://postman.com/path/alpha?q=v#hash',
        relative: '/foo/bar',
        resolved: 'http://postman.com/foo/bar'
    },
    {
        base: 'http://usr:pswd@postman.com/path/alpha?q=v#hash',
        relative: '/foo/bar',
        resolved: 'http://usr:pswd@postman.com/foo/bar'
    },
    {
        base: 'http://postman.com/path/alpha?q1=v1#hash_1',
        relative: '/foo/bar?q2=v2',
        resolved: 'http://postman.com/foo/bar?q2=v2'
    },
    {
        base: 'http://postman.com/path/alpha?q1=v1#hash_1',
        relative: '/foo/bar?q2=v2#hash_2',
        resolved: 'http://postman.com/foo/bar?q2=v2#hash_2'
    },
    {
        base: 'http://postman.com/path/alpha?q1=v1#hash_1',
        relative: '/foo/bar#hash_2',
        resolved: 'http://postman.com/foo/bar#hash_2'
    },

    // base-relative URL
    {
        base: 'http://postman.com/path/alpha',
        relative: 'foo/bar',
        resolved: 'http://postman.com/path/foo/bar'
    },
    {
        base: 'http://[::1]/path/alpha',
        relative: 'foo/bar',
        resolved: 'http://[::1]/path/foo/bar'
    },
    {
        base: 'http://[::1]:8080/path/alpha',
        relative: 'foo/bar',
        resolved: 'http://[::1]:8080/path/foo/bar'
    },
    {
        base: 'http://postman.com/path/alpha/',
        relative: 'foo/bar',
        resolved: 'http://postman.com/path/alpha/foo/bar'
    },
    {
        base: 'http://postman.com/path/alpha',
        relative: 'foo/bar/',
        resolved: 'http://postman.com/path/foo/bar/'
    },
    {
        base: 'http://postman.com/path/alpha',
        relative: 'foo/bar?q2=v2',
        resolved: 'http://postman.com/path/foo/bar?q2=v2'
    },
    {
        base: 'http://postman.com/path/alpha?q1=v1',
        relative: 'foo/bar?q2=v2',
        resolved: 'http://postman.com/path/foo/bar?q2=v2'
    },
    {
        base: 'http://postman.com/path/alpha',
        relative: 'foo/bar?q2=v2#hash_2',
        resolved: 'http://postman.com/path/foo/bar?q2=v2#hash_2'
    },
    {
        base: 'http://postman.com/path/alpha',
        relative: 'foo/bar#hash_2',
        resolved: 'http://postman.com/path/foo/bar#hash_2'
    },
    {
        base: 'http://postman.com/path/alpha',
        relative: '?q2=v2',
        resolved: 'http://postman.com/path/?q2=v2'
    },
    {
        base: 'http://usr:pswd@postman.com/path/alpha',
        relative: 'foo/bar#hash_2',
        resolved: 'http://usr:pswd@postman.com/path/foo/bar#hash_2'
    },

    // path traversal
    {
        base: 'http://postman.com',
        relative: 'https://postman-echo.com/p/q/./../r',
        resolved: 'https://postman-echo.com/p/r'
    },
    {
        base: 'http://postman.com',
        relative: 'https://postman-echo.com/p/q/./../../../../r',
        resolved: 'https://postman-echo.com/r'
    },
    {
        base: 'http://postman.com',
        relative: 'https://postman-echo.com/p/q/./../../../..',
        resolved: 'https://postman-echo.com/'
    },
    {
        base: 'http://postman.com/a/b/c',
        relative: '//postman-echo.com/p/q/./../r',
        resolved: 'http://postman-echo.com/p/q/./../r'
    },
    {
        base: 'http://postman.com/a/b/c',
        relative: '//postman-echo.com/p/q/./../r?q=v#hash',
        resolved: 'http://postman-echo.com/p/q/./../r?q=v#hash'
    },
    {
        base: 'http://postman.com/a/b/c',
        relative: '/p/q/./../r?q=v#hash',
        resolved: 'http://postman.com/p/r?q=v#hash'
    },
    {
        base: 'http://postman.com/a/b/c',
        relative: '/p/q/./../../../../r?q=v#hash',
        resolved: 'http://postman.com/r?q=v#hash'
    },
    {
        base: 'http://postman.com/a/b/c',
        relative: 'p/q/./../r?q=v#hash',
        resolved: 'http://postman.com/a/b/p/r?q=v#hash'
    },
    {
        base: 'http://postman.com/a/b/c',
        relative: 'p/q/./../../../../../r?q=v#hash',
        resolved: 'http://postman.com/r?q=v#hash'
    },
    {
        base: 'http://postman.com/a/b/c/',
        relative: '../r?q=v#hash',
        resolved: 'http://postman.com/a/b/r?q=v#hash'
    }
];

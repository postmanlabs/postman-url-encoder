module.exports = [

    {
        title: 'full URL without special characters',
        in: {
            protocol: 'http',
            auth: { user: 'usr', password: 'pswd' },
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr:pswd',
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://usr:pswd@postman.com:8080/p/a/t/h?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'without hash',
        in: {
            protocol: 'http',
            auth: { user: 'usr', password: 'pswd' },
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr:pswd',
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: null,
            href: 'http://usr:pswd@postman.com:8080/p/a/t/h?q1=v1&q2=v2'
        }
    },
    {
        title: 'without query',
        in: {
            protocol: 'http',
            auth: { user: 'usr', password: 'pswd' },
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr:pswd',
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/p/a/t/h',
            query: null,
            search: null,
            path: '/p/a/t/h',
            hash: '#1234',
            href: 'http://usr:pswd@postman.com:8080/p/a/t/h#1234'
        }
    },
    {
        title: 'without path',
        in: {
            protocol: 'http',
            auth: { user: 'usr', password: 'pswd' },
            host: 'postman.com',
            port: '8080',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr:pswd',
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://usr:pswd@postman.com:8080/?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'without port',
        in: {
            protocol: 'http',
            auth: { user: 'usr', password: 'pswd' },
            host: 'postman.com',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr:pswd',
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://usr:pswd@postman.com/p/a/t/h?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'without host',
        in: {
            protocol: 'http',
            auth: { user: 'usr', password: 'pswd' },
            port: '8080',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr:pswd',
            hostname: '',
            port: '8080',
            host: ':8080',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://usr:pswd@:8080/p/a/t/h?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'without password in auth',
        in: {
            protocol: 'http',
            auth: { user: 'usr' },
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr',
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://usr@postman.com:8080/p/a/t/h?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'without username in auth',
        in: {
            protocol: 'http',
            auth: { password: 'pswd' },
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: ':pswd',
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://:pswd@postman.com:8080/p/a/t/h?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'without username and password in auth',
        in: {
            protocol: 'http',
            auth: {},
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://postman.com:8080/p/a/t/h?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'without auth',
        in: {
            protocol: 'http',
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://postman.com:8080/p/a/t/h?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'without protocol',
        in: {
            auth: { user: 'usr', password: 'pswd' },
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}],
            hash: '1234'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr:pswd',
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/p/a/t/h',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/p/a/t/h?q1=v1&q2=v2',
            hash: '#1234',
            href: 'http://usr:pswd@postman.com:8080/p/a/t/h?q1=v1&q2=v2#1234'
        }
    },
    {
        title: 'only host',
        in: {
            host: 'postman.com'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: null,
            search: null,
            path: '/',
            hash: null,
            href: 'http://postman.com/'
        }
    },
    {
        title: 'only host and port',
        in: {
            host: 'postman.com',
            port: '8080'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: '8080',
            host: 'postman.com:8080',
            pathname: '/',
            query: null,
            search: null,
            path: '/',
            hash: null,
            href: 'http://postman.com:8080/'
        }
    },
    {
        title: 'only host and path',
        in: {
            host: 'postman.com',
            path: '/p/a/t/h'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/p/a/t/h',
            query: null,
            search: null,
            path: '/p/a/t/h',
            hash: null,
            href: 'http://postman.com/p/a/t/h'
        }
    },
    {
        title: 'only host and query',
        in: {
            host: 'postman.com',
            query: [{key: 'q1', value: 'v1'}, {key: 'q2', value: 'v2'}]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: 'q1=v1&q2=v2',
            search: '?q1=v1&q2=v2',
            path: '/?q1=v1&q2=v2',
            hash: null,
            href: 'http://postman.com/?q1=v1&q2=v2'
        }
    },
    {
        title: 'special characters in auth username',
        in: {
            auth: { user: '"#/:;<=>?@[\\]^`{|} ', password: 'pswd' },
            host: 'postman.com'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: '%22%23%2F%3A%3B%3C%3D%3E%3F%40%5B%5C%5D%5E%60%7B%7C%7D%20:pswd',
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: null,
            search: null,
            path: '/',
            hash: null,
            href: 'http://%22%23%2F%3A%3B%3C%3D%3E%3F%40%5B%5C%5D%5E%60%7B%7C%7D%20:pswd@postman.com/'
        }
    },
    {
        title: 'special characters in auth password',
        in: {
            auth: { user: 'usr', password: '"#/:;<=>?@[\\]^`{|} ' },
            host: 'postman.com'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr:%22%23%2F%3A%3B%3C%3D%3E%3F%40%5B%5C%5D%5E%60%7B%7C%7D%20',
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: null,
            search: null,
            path: '/',
            hash: null,
            href: 'http://usr:%22%23%2F%3A%3B%3C%3D%3E%3F%40%5B%5C%5D%5E%60%7B%7C%7D%20@postman.com/'
        }
    },
    {
        title: 'unicode characters in auth',
        in: {
            auth: { user: '𝌆й你ス', password: '𝌆й你ス' },
            host: 'postman.com'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: '%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9:%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9',
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: null,
            search: null,
            path: '/',
            hash: null,
            href: 'http://%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9:%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9@postman.com/'
        }
    },
    {
        title: 'already encoded characters in auth',
        in: {
            auth: { user: 'usr%231', password: 'pswd%231' },
            host: 'postman.com'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: 'usr%231:pswd%231',
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: null,
            search: null,
            path: '/',
            hash: null,
            href: 'http://usr%231:pswd%231@postman.com/'
        }
    },
    {
        title: 'unicode characters in host',
        in: {
            host: '邮差.com'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'xn--nstq34i.com',
            port: null,
            host: 'xn--nstq34i.com',
            pathname: '/',
            query: null,
            search: null,
            path: '/',
            hash: null,
            href: 'http://xn--nstq34i.com/'
        }
    },
    {
        title: 'already encoded unicode host',
        in: {
            host: 'xn--nstq34i.com'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'xn--nstq34i.com',
            port: null,
            host: 'xn--nstq34i.com',
            pathname: '/',
            query: null,
            search: null,
            path: '/',
            hash: null,
            href: 'http://xn--nstq34i.com/'
        }
    },
]
module.exports = [

    {
        title: 'full URL without special characters',
        in: {
            protocol: 'http',
            auth: { user: 'usr', password: 'pswd' },
            host: 'postman.com',
            port: '8080',
            path: '/p/a/t/h',
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }]
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }],
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
        title: 'query param without value',
        in: {
            host: 'postman.com',
            path: '/',
            query: [{ key: 'q1', value: null }]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: 'q1=',
            search: '?q1=',
            path: '/?q1=',
            hash: null,
            href: 'http://postman.com/?q1='
        }
    },
    {
        title: 'query param without key',
        in: {
            host: 'postman.com',
            path: '/',
            query: [{ key: null, value: 'v1' }]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: '=v1',
            search: '?=v1',
            path: '/?=v1',
            hash: null,
            href: 'http://postman.com/?=v1'
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
            query: [{ key: 'q1', value: 'v1' }, { key: 'q2', value: 'v2' }]
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
    {
        title: 'special characters in path',
        in: {
            host: 'postman.com',
            path: '/ /"/#/</>/?/`/{/}'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/%20/%22/%23/%3C/%3E/%3F/%60/%7B/%7D',
            query: null,
            search: null,
            path: '/%20/%22/%23/%3C/%3E/%3F/%60/%7B/%7D',
            hash: null,
            href: 'http://postman.com/%20/%22/%23/%3C/%3E/%3F/%60/%7B/%7D'
        }
    },
    {
        title: 'unicode characters in path',
        in: {
            host: 'postman.com',
            path: '/𝌆/й/你/ス'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/%F0%9D%8C%86/%D0%B9/%E4%BD%A0/%E3%82%B9',
            query: null,
            search: null,
            path: '/%F0%9D%8C%86/%D0%B9/%E4%BD%A0/%E3%82%B9',
            hash: null,
            href: 'http://postman.com/%F0%9D%8C%86/%D0%B9/%E4%BD%A0/%E3%82%B9'
        }
    },
    {
        title: 'already encoded characters in path',
        in: {
            host: 'postman.com',
            path: '/%25'
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/%25',
            query: null,
            search: null,
            path: '/%25',
            hash: null,
            href: 'http://postman.com/%25'
        }
    },
    {
        title: 'special characters in query param key',
        in: {
            host: 'postman.com',
            query: [{ key: ' "#\'<>', value: 'v1' }]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: '%20%22%23%27%3C%3E=v1',
            search: '?%20%22%23%27%3C%3E=v1',
            path: '/?%20%22%23%27%3C%3E=v1',
            hash: null,
            href: 'http://postman.com/?%20%22%23%27%3C%3E=v1'
        }
    },
    {
        title: 'special characters in query param value',
        in: {
            host: 'postman.com',
            query: [{ key: 'q1', value: ' "#\'<>' }]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: 'q1=%20%22%23%27%3C%3E',
            search: '?q1=%20%22%23%27%3C%3E',
            path: '/?q1=%20%22%23%27%3C%3E',
            hash: null,
            href: 'http://postman.com/?q1=%20%22%23%27%3C%3E'
        }
    },
    {
        title: 'unicode characters in query param key',
        in: {
            host: 'postman.com',
            query: [{ key: '𝌆й你ス', value: 'v1' }]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: '%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9=v1',
            search: '?%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9=v1',
            path: '/?%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9=v1',
            hash: null,
            href: 'http://postman.com/?%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9=v1'
        }
    },
    {
        title: 'unicode characters in query param value',
        in: {
            host: 'postman.com',
            query: [{ key: 'q1', value: '𝌆й你ス' }]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: 'q1=%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9',
            search: '?q1=%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9',
            path: '/?q1=%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9',
            hash: null,
            href: 'http://postman.com/?q1=%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9'
        }
    },
    {
        title: 'already encoded characters in query param key',
        in: {
            host: 'postman.com',
            query: [{ key: '%25', value: 'v1' }]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: '%25=v1',
            search: '?%25=v1',
            path: '/?%25=v1',
            hash: null,
            href: 'http://postman.com/?%25=v1'
        }
    },
    {
        title: 'already encoded characters in query param value',
        in: {
            host: 'postman.com',
            query: [{ key: 'q1', value: '%25' }]
        },
        out: {
            protocol: 'http:',
            slashes: true,
            auth: null,
            hostname: 'postman.com',
            port: null,
            host: 'postman.com',
            pathname: '/',
            query: 'q1=%25',
            search: '?q1=%25',
            path: '/?q1=%25',
            hash: null,
            href: 'http://postman.com/?q1=%25'
        }
    },
    {
        title: 'special characters in hash',
        in: {
            host: 'postman.com',
            hash: ' "<>`'
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
            hash: '#%20%22%3C%3E%60',
            href: 'http://postman.com/#%20%22%3C%3E%60'
        }
    },
    {
        title: 'unicode characters in hash',
        in: {
            host: 'postman.com',
            hash: '𝌆й你ス'
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
            hash: '#%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9',
            href: 'http://postman.com/#%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9'
        }
    },
    {
        title: 'already encoded characters in hash',
        in: {
            host: 'postman.com',
            hash: '%25'
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
            hash: '#%25',
            href: 'http://postman.com/#%25'
        }
    }
];

const sdk = require('postman-collection'),
    querystring = require('querystring'),

    percentEncode = require('./percent-encode'),
    encoder = require('./encoder'),

    E = '',
    COLON = ':',
    STRING = 'string',
    OBJECT = 'object',
    DEFAULT_PROTOCOL = 'http',

    QUERY_SEPARATOR = '?',
    SEARCH_SEPARATOR = '#',
    PROTOCOL_SEPARATOR = '//',
    AUTH_CREDENTIALS_SEPARATOR = '@',

    /**
     * Protocols that always contain a // bit.
     *
     * @see {@link https://github.com/nodejs/node/blob/v10.17.0/lib/url.js#L91}
     */
    SLASHED_PROTOCOLS = new Set([
        'http:',
        'https:',
        'ftp:',
        'gopher:',
        'file:',
        'ws:',
        'wss:'
    ]);

module.exports = {
    // @todo remove after fixing tests
    encoder: encoder,

    /**
     * Percent encode a given string according to given escape table.
     *
     * @param {String} value string to percent-encode
     * @param {Number[]} [escapeTable=QUERY_ENCODE_SET] escape table to use for encoding
     * @returns {String} percent-encoded string
     */
    encode: percentEncode.encode,

    /**
     * Converts urlencoded body object to string according to RFC3986
     *
     * @param {Object} body object representing urlencoded body (ex. {foo: 'bar', alpha: ['beta', 'gama]})
     * @returns {String} stringified urlencoded body
     */
    stringifyUrlencodedBody: function (body) {
        if (!(body && typeof body === OBJECT)) {
            return E;
        }

        body = querystring.stringify(body);

        // encode characters not encoded by querystring.stringify() according to RFC3986.
        return body.replace(/[!'()*]/g, function (c) {
            return percentEncode.encodeSingle(c.charCodeAt(0));
        });
    },

    /**
     * Converts URL string into Node's Url object with encoded values
     *
     * @param {PostmanUrl|String} url Url to create Node URL object from
     * @returns {Url} Node's Url object
     */
    toNodeUrl: function (url) {
        var nodeUrl = {
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

        if (typeof url === STRING) {
            url = new sdk.Url(url);
        }

        if (!sdk.Url.isUrl(url)) {
            return nodeUrl;
        }

        // protocol
        nodeUrl.protocol = (typeof url.protocol === STRING) ?
            url.protocol.replace('://', E).toLowerCase() : DEFAULT_PROTOCOL;
        nodeUrl.protocol += COLON;

        // slashes
        nodeUrl.slashes = SLASHED_PROTOCOLS.has(nodeUrl.protocol);

        // protocol://
        nodeUrl.href = nodeUrl.protocol + PROTOCOL_SEPARATOR;

        // auth
        if (url.auth) {
            if (typeof url.auth.user === STRING) {
                nodeUrl.auth = encoder.encodeAuth(url.auth.user);
            }
            if (typeof url.auth.password === STRING) {
                !nodeUrl.auth && (nodeUrl.auth = E);
                nodeUrl.auth += COLON + encoder.encodeAuth(url.auth.password);
            }

            // protocol://user:password@
            nodeUrl.auth && (nodeUrl.href += nodeUrl.auth + AUTH_CREDENTIALS_SEPARATOR);
        }

        // host
        nodeUrl.host = nodeUrl.hostname = encoder.encodeHost(url.getHost()).toLowerCase();

        // protocol://user:password@hostname
        nodeUrl.href += nodeUrl.hostname;

        // port
        if (url.port) {
            nodeUrl.port = url.port.toString();
            nodeUrl.host = (nodeUrl.hostname || E) + COLON + nodeUrl.port;

            // protocol://user:password@hostname:port
            nodeUrl.href += COLON + nodeUrl.port;
        }

        // path
        nodeUrl.path = nodeUrl.pathname = encoder.encodePath(url.getPath());

        // protocol://user:password@hostname:port/p/a/t/h
        nodeUrl.href += nodeUrl.pathname;

        // query
        if (url.query.count()) {
            nodeUrl.query = encoder.encodeQueryParams(url.query.all(), true);
            nodeUrl.search = QUERY_SEPARATOR + nodeUrl.query;
            nodeUrl.path = nodeUrl.pathname + nodeUrl.search;

            // protocol://user:password@hostname:port/p/a/t/h?q=query
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.search;
        }

        // hash
        if (url.hash) {
            nodeUrl.hash = SEARCH_SEPARATOR + encoder.encodeHash(url.hash);

            // protocol://user:password@hostname:port/p/a/t/h?q=query#hash
            nodeUrl.href += nodeUrl.hash;
        }

        return nodeUrl;
    }
};

/**
 * Implementation of the WHATWG URL Standard.
 *
 * @example
 * const urlEncoder = require('postman-url-encoder')
 *
 * // Encoding URL string to Node.js compatible Url object
 * urlEncoder.toNodeUrl('郵便屋さん.com/foo&bar/{baz}?q=("foo")#`hash`')
 *
 * // Encoding URI component
 * urlEncoder.encode('qüêry štrìng')
 *
 * // Encoding query string object
 * urlEncoder.encodeQueryString({ q1: 'foo', q2: ['bãr', 'baž'] })
 *
 * @module postman-url-encoder
 * @see {@link https://url.spec.whatwg.org}
 */

const sdk = require('postman-collection'),
    querystring = require('querystring'),

    legacy = require('./legacy'),
    encoder = require('./encoder'),
    QUERY_ENCODE_SET = require('./encoder/encode-set').QUERY_ENCODE_SET,

    E = '',
    COLON = ':',
    STRING = 'string',
    OBJECT = 'object',
    FUNCTION = 'function',
    DOUBLE_SLASH = '//',
    BACK_SLASH = '\\',
    DOUBLE_BACK_SLASH = '\\\\',
    PATH_SEPARATOR = '/',
    DEFAULT_PROTOCOL = 'http',

    QUERY_SEPARATOR = '?',
    SEARCH_SEPARATOR = '#',
    AUTH_CREDENTIALS_SEPARATOR = '@',

    /**
     * Protocols that always contain a // bit.
     *
     * @private
     * @see {@link https://github.com/nodejs/node/blob/v10.17.0/lib/url.js#L91}
     */
    SLASHED_PROTOCOLS = {
        'file:': true,
        'ftp:': true,
        'gopher:': true,
        'http:': true,
        'https:': true,
        'ws:': true,
        'wss:': true
    };

/**
 * Percent-encode the given string using QUERY_ENCODE_SET.
 *
 * @deprecated since version 2.0, use {@link encodeQueryParam} instead.
 *
 * @example
 * // returns 'foo%20%22%23%26%27%3C%3D%3E%20bar'
 * encode('foo "#&\'<=> bar')
 *
 * // returns ''
 * encode(['foobar'])
 *
 * @param {String} value String to percent-encode
 * @returns {String} Percent-encoded string
 */
function encode (value) {
    return encoder.percentEncode(value, QUERY_ENCODE_SET);
}

/**
 * Percent-encode the URL query string or x-www-form-urlencoded body object
 * according to RFC3986.
 *
 * @example
 * // returns 'q1=foo&q2=bar&q2=baz'
 * encodeQueryString({ q1: 'foo', q2: ['bar', 'baz'] })
 *
 * @param {Object} query Object representing query or urlencoded body
 * @returns {String} Percent-encoded string
 */
function encodeQueryString (query) {
    if (!(query && typeof query === OBJECT)) {
        return E;
    }

    // rely upon faster querystring module
    query = querystring.stringify(query);

    // encode characters not encoded by querystring.stringify() according to RFC3986.
    return query.replace(/[!'()*]/g, function (c) {
        return encoder.percentEncodeCharCode(c.charCodeAt(0));
    });
}

/**
 * Converts PostmanUrl / URL string into Node.js compatible Url object.
 *
 * @example <caption>Using URL string</caption>
 * toNodeUrl('郵便屋さん.com/foo&bar/{baz}?q=("foo")#`hash`')
 * // returns
 * // {
 * //     protocol: 'http:',
 * //     slashes: true,
 * //     auth: null,
 * //     host: 'xn--48jwgn17gdel797d.com',
 * //     port: null,
 * //     hostname: 'xn--48jwgn17gdel797d.com',
 * //     hash: '#%60hash%60',
 * //     search: '?q=(%22foo%22)',
 * //     query: 'q=(%22foo%22)',
 * //     pathname: '/foo&bar/%7Bbaz%7D',
 * //     path: '/foo&bar/%7Bbaz%7D?q=(%22foo%22)',
 * //     href: 'http://xn--48jwgn17gdel797d.com/foo&bar/%7Bbaz%7D?q=(%22foo%22)#%60hash%60'
 * //  }
 *
 * @example <caption>Using PostmanUrl instance</caption>
 * toNodeUrl(new sdk.Url({
 *     host: 'example.com',
 *     query: [{ key: 'foo', value: 'bar & baz' }]
 * }))
 *
 * @param {PostmanUrl|String} url
 * @param {Boolean} disableEncoding
 * @returns {Url}
 */
function toNodeUrl (url, disableEncoding) {
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
            href: E
        },
        port,
        hostname,
        pathname,
        authUser,
        authPassword,
        queryParams;

    // convert URL string to PostmanUrl
    if (typeof url === STRING) {
        url = new sdk.Url(url);
    }

    // bail out if given url is not a PostmanUrl instance
    if (!sdk.Url.isUrl(url)) {
        return nodeUrl;
    }

    // @note getPath() always adds a leading '/', similar to Node.js API
    pathname = url.getPath();
    hostname = url.getHost().toLowerCase();

    if (url.query && url.query.count()) {
        queryParams = disableEncoding ? url.getQueryString({ ignoreDisabled: true }) :
            encoder.encodeQueryParams(url.query.all());

        // either all the params are disabled or a single param is like { key: '' } (http://localhost?)
        // in that case, query separator ? must be included in the raw URL.
        // @todo Add helper in SDK to handle this
        if (queryParams === E) {
            // check if there's any enabled param, if so, set queryString to empty string
            // otherwise (all disabled), it will be set as undefined
            queryParams = url.query.find(function (param) { return !(param && param.disabled); }) && E;
        }
    }

    if (url.auth) {
        authUser = url.auth.user;
        authPassword = url.auth.password;
    }

    // @todo Add helper in SDK to normalize port
    // eslint-disable-next-line no-eq-null, eqeqeq
    if (!(url.port == null) && typeof url.port.toString === FUNCTION) {
        port = url.port.toString();
    }

    // #protocol
    nodeUrl.protocol = (typeof url.protocol === STRING) ? url.protocol.toLowerCase() : DEFAULT_PROTOCOL;
    nodeUrl.protocol += COLON;

    // #slashes
    nodeUrl.slashes = SLASHED_PROTOCOLS[nodeUrl.protocol] || false;

    // #href = protocol://
    nodeUrl.href = nodeUrl.protocol + DOUBLE_SLASH;

    // #auth
    if (url.auth) {
        if (typeof authUser === STRING) {
            nodeUrl.auth = disableEncoding ? authUser : encoder.encodeUserInfo(authUser);
        }

        if (typeof authPassword === STRING) {
            !nodeUrl.auth && (nodeUrl.auth = E);
            nodeUrl.auth += COLON + (disableEncoding ? authPassword : encoder.encodeUserInfo(authPassword));
        }

        if (typeof nodeUrl.auth === STRING) {
            // #href = protocol://user:password@
            nodeUrl.href += nodeUrl.auth + AUTH_CREDENTIALS_SEPARATOR;
        }
    }

    // #host, #hostname
    nodeUrl.host = nodeUrl.hostname = encoder.encodeHost(hostname); // @note always encode hostname

    // #href = protocol://user:password@host.name
    nodeUrl.href += nodeUrl.hostname;

    // #port
    if (typeof port === STRING) {
        nodeUrl.port = port;

        // #host = (#hostname):(#port)
        nodeUrl.host = nodeUrl.hostname + COLON + port;

        // #href = protocol://user:password@host.name:port
        nodeUrl.href += COLON + port;
    }

    // #path, #pathname
    nodeUrl.path = nodeUrl.pathname = disableEncoding ? pathname : encoder.encodePath(pathname);

    // #href = protocol://user:password@host.name:port/p/a/t/h
    nodeUrl.href += nodeUrl.pathname;

    if (typeof queryParams === STRING) {
        // #query
        nodeUrl.query = queryParams;

        // #search
        nodeUrl.search = QUERY_SEPARATOR + nodeUrl.query;

        // #path = (#pathname)?(#search)
        nodeUrl.path = nodeUrl.pathname + nodeUrl.search;

        // #href = protocol://user:password@host.name:port/p/a/t/h?q=query
        nodeUrl.href += nodeUrl.search;
    }

    if (typeof url.hash === STRING) {
        // #hash
        nodeUrl.hash = SEARCH_SEPARATOR + (disableEncoding ? url.hash : encoder.encodeFragment(url.hash));

        // #href = protocol://user:password@host.name:port/p/a/t/h?q=query#hash
        nodeUrl.href += nodeUrl.hash;
    }

    return nodeUrl;
}

/**
 * Returns stringified URL from Url object but only includes parts till given
 * part name.
 *
 * @example
 * var url = 'http://postman.com/foo?q=v#hash';
 * getUrlTill(toNodeUrl(url), 'host')
 * // returns 'http://postman.com'
 *
 * @private
 * @param {Object} url base URL
 * @param {String} [urlPart='query'] one of ['host', 'pathname', 'query']
 */
function getUrlTill (url, urlPart) {
    var result = '';

    if (url.protocol) {
        result += url.protocol + DOUBLE_SLASH;
    }

    if (url.auth) {
        result += url.auth + AUTH_CREDENTIALS_SEPARATOR;
    }

    result += url.host || E;

    if (urlPart === 'host') { return result; }

    result += url.pathname;

    if (urlPart === 'pathname') { return result; }

    // urlPart must be query at this point
    return result + (url.search || E);
}

/**
 * Resolves a relative URL with respect to given base URL. This is a replacement method for Node's url.resolve()
 * which is compatible with URL object generated by toNodeUrl().
 *
 * @param {Object|String} base base URL from toNodeUrl() or URL string
 * @param {String} relative relative URL to resolve
 * @returns {String} resolved URL
 */
function resolveNodeUrl (base, relative) {
    if (typeof base === STRING) {
        base = toNodeUrl(base);
    }

    var isValidBase = true,
        baseHref,
        basePathname,
        pathEndIndex,
        queryIndex,
        hashIndex,
        protocolIndex;

    [
        'protocol',
        'auth',
        'host',
        'pathname',
        'search',
        'hash'
    ].forEach(function (property) {
        isValidBase = isValidBase && base.hasOwnProperty(property);
    });

    if (typeof relative !== STRING) {
        relative = E;
    }

    // bail out if base is not NodeUrl like object
    if (!isValidBase) { return relative; }

    baseHref = base.href;
    basePathname = base.pathname;

    /* #1 relative is empty */
    if (!relative) {
        // return base if there is no hash
        if ((hashIndex = baseHref.indexOf(SEARCH_SEPARATOR)) === -1) {
            return baseHref;
        }

        // remove hash from base and return
        return baseHref.slice(0, hashIndex);
    }

    /* #2 protocol-relative URL */

    // #2.1 relative starts with //
    if (relative.startsWith(DOUBLE_SLASH)) {
        return base.protocol + relative;
    }

    // #2.2 relative starts with \\
    if (relative.startsWith(DOUBLE_BACK_SLASH)) {
        return base.protocol + relative.replace(DOUBLE_BACK_SLASH, DOUBLE_SLASH);
    }

    /* #3 path-relative URL */

    if (relative.startsWith(PATH_SEPARATOR) || relative.startsWith(BACK_SLASH)) {
        return getUrlTill(base, 'host') + relative;
    }

    /* #4 base-relative URL without path */

    // #4.1 relative starts with #
    if ((hashIndex = relative.indexOf(SEARCH_SEPARATOR)) === 0) {
        return getUrlTill(base, 'query') + relative;
    }

    // #4.2 relative starts with ?
    if ((queryIndex = relative.indexOf(QUERY_SEPARATOR)) === 0) {
        return getUrlTill(base, 'pathname') + relative;
    }

    queryIndex === -1 && (queryIndex = Infinity);
    hashIndex === -1 && (hashIndex = Infinity);

    pathEndIndex = Math.min(queryIndex, hashIndex);

    /* #5 relative is an absolute URL */

    // #5.1 protocol separator is ://
    if ((protocolIndex = relative.indexOf('://')) !== -1 && protocolIndex < pathEndIndex) {
        return relative;
    }

    // #5.2 protocol separator is :\\
    if ((protocolIndex = relative.indexOf(':\\\\')) !== -1 && protocolIndex < pathEndIndex) {
        // change protocol separator from :\\ to :// and return
        return relative.replace(DOUBLE_BACK_SLASH, DOUBLE_SLASH);
    }

    /* #6 base-relative URL with path */

    // remove last path segment form base path
    basePathname = basePathname.slice(0, basePathname.lastIndexOf(PATH_SEPARATOR) + 1);

    return getUrlTill(base, 'host') + basePathname + relative;
}

/**
 * Converts URL string into Node.js compatible Url object using the v1 encoder.
 *
 * @deprecated since version 2.0
 *
 * @param {String} url URL string
 * @returns {Url} Node.js compatible Url object
 */
function toLegacyNodeUrl (url) {
    return legacy.toNodeUrl(url);
}

module.exports = {
    encode,
    toNodeUrl,
    resolveNodeUrl,
    toLegacyNodeUrl,
    encodeQueryString
};

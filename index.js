var punycode = require('punycode'),

    /**
     * @private
     * @const
     * @type {String}
     */
    E = '',

    /**
     * @private
     * @const
     * @type {String}
     */
    PROTOCOL_SEPARATOR = '://',

    /**
     * @private
     * @const
     * @type {String}
     */
    PROTOCOL_HTTP = 'http',

    /**
     * @private
     * @const
     * @type {String}
     */
    DEFAULT_PROTOCOL = PROTOCOL_HTTP + PROTOCOL_SEPARATOR,

    /**
     * @private
     * @const
     * @type {String}
     */
    COLON = ':',

    /**
     * @private
     * @const
     * @type {String}
     */
    AUTH_CREDENTIALS_SEPARATOR = '@',

    /**
     * @private
     * @const
     * @type {String}
     */
    DOMAIN_SEPARATOR = '.',

    /**
     * @private
     * @const
     * @type {String}
     */
    PATH_SEPARATOR = '/',

    /**
     * @private
     * @const
     * @type {String}
     */
    QUERY_SEPARATOR = '?',

    /**
     * @private
     * @const
     * @type {String}
     */
    SEARCH_SEPARATOR = '#',

    /**
     * @private
     * @const
     * @type {String}
     */
    AMPERSAND = '&',

    /**
     * @private
     * @const
     * @type {String}
     */
    EQUALS = '=',

    /**
     * @private
     * @const
     * @type {String}
     */
    PERCENT = '%',

    /**
     * @private
     * @const
     * @type {string}
     */
    ZERO = '0',

    /**
     * These characters do not need escaping when encoding strings:
     * + - . _ ~
     * digits
     * alpha (uppercase)
     * alpha (lowercase)
     *
     * @private
     * @const
     * @type {Number[]}
     */
    noEscape = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, // 32 - 47
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // 80 - 95
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0  // 112 - 127
    ],

    encoder;

encoder = {

    /**
     * Percent encode a character with given code.
     *
     * @param {Number} c - character code of the character to encode
     * @returns {String} - percent encoding of given character
     */
    percentEncode: function(c) {
        var hex = c.toString(16).toUpperCase();
        (hex.length === 1) && (hex = ZERO + hex);
        return PERCENT + hex;
    },

    /**
     * Checks if character at given index in the buffer is already percent encoded or not.
     *
     * @param {Buffer} buffer
     * @param {Number} i
     * @returns {Boolean}
     */
    isPreEncoded: function(buffer, i) {
    // If it is % check next two bytes for percent encode characters
    // looking for pattern %00 - %FF
        return (buffer[i] === 0x25 &&
            (encoder.isPreEncodedCharacter(buffer[i + 1]) &&
            encoder.isPreEncodedCharacter(buffer[i + 2]))
          );
    },

    /**
     * Checks if character with given code is valid hexadecimal digit or not.
     *
     * @param {Number} byte
     * @returns {Boolean}
     */
    isPreEncodedCharacter: function(byte) {
        return (byte >= 0x30 && byte <= 0x39) ||  // 0-9
           (byte >= 0x41 && byte <= 0x46) ||  // A-F
           (byte >= 0x61 && byte <= 0x66);     // a-f
    },

    /**
     * Checks whether given character should be percent encoded or not for fixture.
     *
     * @param {Number} byte
     * @returns {Boolean}
     */
    charactersToPercentEncodeForFixture: function(byte) {
        return (byte < 0x23 || byte > 0x7E || // Below # and after ~
            byte === 0x3C || byte === 0x3E || // > and <
            byte === 0x28 || byte === 0x29 || // ( and )
            byte === 0x25 || // %
            byte === 0x27 || // '
            byte === 0x2A    // *
        );
    },

    /**
     * Checks whether given character should be percent encoded or not according to RFC 3986.
     *
     * @param {Number} byte
     * @returns {Boolean}
     */
    charactersToPercentEncode: function(byte) {
        // Look in noEscape table if given character is in range of ASCII
        if (byte < 0x80) return !Boolean(noEscape[byte]);

        // Always encode non ASCII characters
        return true;
    },

    /**
     * Percent encode a given string according to RFC 3986.
     *
     * @param {String} value
     * @returns {String}
     */
    encodeString: function (value) {
        if (!(value && typeof value === 'string')) { return E; }

        var buffer = Buffer.from(value),
            ret = E,
            i,
            ii;

        for (i = 0, ii = buffer.length; i < ii; ++i) {

            if (encoder.charactersToPercentEncode(buffer[i]) && !encoder.isPreEncoded(buffer, i)) {
                ret += encoder.percentEncode(buffer[i]);
            }
            else {
                ret += String.fromCodePoint(buffer[i]);  // Only works in ES6 (available in Node v4+)
            }
        }

        return ret;
    },

    /**
     * Percent encode a query string according to RFC 3986.
     * Note: This function is supposed to be used on top of node's inbuilt url encoding
     *       to solve issue https://github.com/nodejs/node/issues/8321
     *
     * @param {String} value
     * @returns {String}
     */
    encode: function (value) {
        if (!(value && typeof value === 'string')) { return E; }

        var buffer = Buffer.from(value),
            ret = E,
            i,
            ii;

        for (i = 0, ii = buffer.length; i < ii; ++i) {

            if (encoder.charactersToPercentEncodeForFixture(buffer[i]) && !encoder.isPreEncoded(buffer, i)) {
                ret += encoder.percentEncode(buffer[i]);
            }
            else {
                ret += String.fromCodePoint(buffer[i]);  // Only works in ES6 (available in Node v4+)
            }
        }

        return ret;
    },

    /**
     * Does punycode encoding of hostName according to RFC 3492 and RFC 5891
     *
     * @param {String|String[]} hostName
     * @returns {String}
     */
    encodeHost: function (hostName) {
        if (!hostName) { return E; }

        if (Array.isArray(hostName)) {
            hostName = hostName.join(DOMAIN_SEPARATOR);
        }

        return punycode.toASCII(hostName);
    },

    /**
     * Encodes individual url-path segments
     *
     * @param {String|String[]} path - complete unencoded path (ex. '/foo/bar')
     * @returns {String}
     */
    encodePath: function (path) {
        if (typeof path === 'string') {
            path = path.split(PATH_SEPARATOR);
        }

        if (!(Array.isArray(path) && path.length)) {
            return E;
        }

        // encode individual segments of path
        path = path.map(function (segment) {
            return encoder.encodeString(segment);
        });

        return path.join(PATH_SEPARATOR);
    },

    /**
     * Encodes single query parameter and returns as a string
     *
     * @param {Object} param - example: {key:'foo1', value:'bar1'}
     * @returns {String}
     */
    encodeQueryParam: function (param) {
        if (!param) { return E; }

        var key = param.key,
            value = param.value;

        if (key === undefined || key === null) {
            key = E;
        }

        if (value === undefined || value === null) {
            value = E;
        }

        if (key === E && value === E) {
            return E;
        }

        key = encoder.encodeString(key);
        value = encoder.encodeString(value);

        return key + EQUALS + value;
    },

    /**
     * Encodes list of query parameters and returns encoded query string
     *
     * @param {Object|Object[]} params - example: [{key:'foo1', value:'bar1'}, {key:'foo2', value:'bar2'}]
     * @param {Boolean} [ignoreDisabled=false]
     * @returns {String}
     */
    encodeQueryParams: function (params, ignoreDisabled) {
        var result = E;

        if (!Array.isArray(params)) {
            if (!(params && typeof params === 'object')) { return E; }

            Object.keys(params).forEach(function (key) {
                var encoded = encoder.encodeQueryParam({ key: key, value: params[key] });

                result && encoded && (result += AMPERSAND);
                result += encoded;
            });

            return result;
        }

        params.forEach(function (param) {
            if (ignoreDisabled && param.disabled === true) { return; }

            var encoded = encoder.encodeQueryParam(param);

            result && encoded && (result += AMPERSAND);
            result += encoded;
        });

        return result;
    },

    /**
     * Unparses a {PostmanUrl} into an encoded URL string.
     *
     * @param {PostmanUrl}
     * @param {Boolean} [forceProtocol=false] - Forces the URL to have a protocol
     * @returns {String}
     */
    encodeUrl: function (url, forceProtocol) {
        if (!(url && typeof url === 'object')) { return E; }

        var encodedUrl = E,
            protocol = url.protocol;

        forceProtocol && !protocol && (protocol = DEFAULT_PROTOCOL);

        if (protocol) {
            encodedUrl += (protocol.endsWith(PROTOCOL_SEPARATOR) ? protocol : protocol + PROTOCOL_SEPARATOR);
        }

        if (url.auth && url.auth.user) { // If the user is not specified, ignore the password.
            encodedUrl = encodedUrl + ((url.auth.password) ?
                // ==> username:password@
                url.auth.user + COLON + url.auth.password : url.auth.user) + AUTH_CREDENTIALS_SEPARATOR;
        }

        if (url.host) {
            encodedUrl += encoder.encodeHost(url.getHost());
        }

        if (url.port) {
            encodedUrl += COLON + url.port.toString();
        }

        if (url.path) {
            encodedUrl += encoder.encodePath(url.getPath());
        }

        if (url.query && url.query.count()) {
            encodedUrl += QUERY_SEPARATOR + encoder.encodeQueryParams(url.query.all(), true);
        }

        if (url.hash) {
            encodedUrl += SEARCH_SEPARATOR + encoder.encodeString(url.hash);
        }

        return encodedUrl;
    },

    /**
     * Converts {PostmanUrl} object into Node's Url object with encoded values
     *
     * @param {PostmanUrl} url
     * @returns {Url}
     */
    toNodeUrl: function (url) {
        var nodeUrl = {
                protocol: null,
                auth: null,
                host: null,
                port: null,
                hostname: null,
                hash: null,
                search: null,
                query: null,
                pathname: PATH_SEPARATOR,
                path: PATH_SEPARATOR,
                href: null
            };

        if (!(url && typeof url === 'object')) { return nodeUrl; }

        if (url.protocol) {
            // remove '://' from end of protocol if it is there
            nodeUrl.protocol = url.protocol.replace(/:\/\/$/, '').toLowerCase();
            nodeUrl.href = nodeUrl.protocol + PROTOCOL_SEPARATOR;
            nodeUrl.protocol = nodeUrl.protocol + COLON;
        }

        if (url.auth && url.auth.user) { // If the user is not specified, ignore the password.
            nodeUrl.auth = ((url.auth.password) ?
                // ==> username:password@
                url.auth.user + COLON + url.auth.password : url.auth.user);
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.auth + AUTH_CREDENTIALS_SEPARATOR;
        }

        if (url.host) {
            nodeUrl.hostname = encoder.encodeHost(url.getHost()).toLowerCase();
            nodeUrl.host = nodeUrl.hostname;
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.hostName;
        }

        if (url.port) {
            nodeUrl.port = url.port.toString();
            nodeUrl.host = (nodeUrl.hostname || E) + COLON + nodeUrl.port;
            nodeUrl.href = (nodeUrl.href || E) + COLON + nodeUrl.port;
        }

        if (url.path) {
            nodeUrl.pathname = encoder.encodePath(url.getPath());
            nodeUrl.path = nodeUrl.pathname;
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.pathname;
        }

        if (url.query && url.query.count()) {
            nodeUrl.query = encoder.encodeQueryParams(url.query.all(), true);
            nodeUrl.search = QUERY_SEPARATOR + nodeUrl.query;
            nodeUrl.path = (nodeUrl.pathname || E) + nodeUrl.search;
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.search;
        }

        if (url.hash) {
            nodeUrl.hash = SEARCH_SEPARATOR + encoder.encodeString(url.hash);
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.search;
        }

        return nodeUrl;
    }
};

module.exports = encoder;

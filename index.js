var url = require('url'),
    sdk = require('postman-collection'),
    querystring = require('querystring'),

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
    DOMAIN_SEPARATOR = '.',

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
     * @type {String}
     */
    COLON = ':',

    /**
     * @private
     * @const
     * @type {string}
     */
    ZERO = '0',

    /**
     * @private
     * @const
     * @type {String}
     */
    PROTOCOL_SEPARATOR = '//',

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
    PATH_SEPARATOR = '/',

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
    DEFAULT_PROTOCOL = 'http',

    /**
     * @private
     * @const
     * @type {String}
     */
    STRING = 'string',

    /**
     * @private
     * @const
     * @type {String}
     */
    OBJECT = 'object',

    /**
     * These characters needs to be encoded when encoding auth in URL.
     * Borrowed from: https://github.com/nodejs/node/blob/v10.17.0/src/node_url.cc#L466
     *
     * [0-31, 127] - non printable ASCII
     * space " # / : ; < = > ? @ [ \ ] ^ ` { | }
     *
     * @private
     * @const
     * @type {Number[]}
     */
    AUTH_ESCAPE_TABLE = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0 - 15
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 16 - 31
        1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // 32 - 47
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, // 48 - 63
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 64 - 79
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, // 80 - 95
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 96 - 111
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1 // 112 - 127
    ],

    /**
     * These characters needs to be encoded when encoding URL path.
     * Borrowed from: https://github.com/nodejs/node/blob/v10.17.0/src/node_url.cc#L399
     *
     * [0-31, 127] - non printable ASCII
     * space " # < > ? ` { }
     *
     * @private
     * @const
     * @type {Number[]}
     */
    PATH_ESCAPE_TABLE = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0 - 15
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 16 - 31
        1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 32 - 47
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, // 48 - 63
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 64 - 79
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 80 - 95
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 96 - 111
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1 // 112 - 127
    ],

    /**
     * These characters needs to be encoded when encoding URL query.
     * Borrowed from: https://github.com/nodejs/node/blob/v10.17.0/src/node_url.cc#L601
     * and added two extra characcters (& and =).
     *
     * [0-31, 127] - non printable ASCII
     * space " # & ' < = >
     *
     * @private
     * @const
     * @type {Number[]}
     */
    QUERY_ESCAPE_TABLE = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0 - 15
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 16 - 31
        1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, // 32 - 47
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, // 48 - 63
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 64 - 79
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 80 - 95
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 96 - 111
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 // 112 - 127
    ],

    /**
     * These characters needs to be encoded when encoding hash in URL.
     * Borrowed from: https://github.com/nodejs/node/blob/v10.17.0/src/node_url.cc#L331
     *
     * [0-31, 127] - non printable ASCII
     * space " < > `
     *
     * @private
     * @const
     * @type {Number[]}
     */
    HASH_ESCAPE_TABLE = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0 - 15
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 16 - 31
        1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 32 - 47
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, // 48 - 63
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 64 - 79
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 80 - 95
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 96 - 111
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 // 112 - 127
    ],

    /**
     * Protocols that always contain a '//' in the end.
     * Borrowed from: https://github.com/nodejs/node/blob/v10.17.0/lib/url.js#L91
     *
     * @private
     * @const
     * @type {Set}
     */
    SLASHED_PROTOCOLS = new Set([
        'http:',
        'https:',
        'ftp:',
        'gopher:',
        'file:',
        'ws:',
        'wss:'
    ]),

    encoder,
    isPreEncoded,
    legacyEncoder,
    domainToASCII,
    percentEncode,
    parseQueryString,
    stringifyQueryParams,
    isPreEncodedCharacter,
    charactersToPercentEncode,
    charactersToPercentEncodeExtra;

/**
 * Returns the Punycode ASCII serialization of the domain.
 * If domain is an invalid domain, the empty string is returned.
 *
 * @note Fallback to `punycode` as url.domainToASCII is supported in
 * Node version >= 6.13.0.
 *
 * @param {String} domain domain name
 * @returns {String} punycode encoded domain name
 */
domainToASCII = typeof url.domainToASCII === 'function' ?
    url.domainToASCII : require('punycode').toASCII;

/**
 * Parses a query string into an array, preserving parameter values
 *
 * @todo: This function is only used in legacyEncoder. Remove it when we remove
 *        the legacyEncoder
 *
 * @param {String} string query string to parse (ex. k1=v1&k2=v2)
 * @returns {Object[]} array of parsed query objects (ex. [{key: 'k1', value: 'v1'},{key: 'k2', value: 'v2'}])
 */
parseQueryString = function (string) {
    var parts;

    if (typeof string === STRING) {
        parts = string.split(AMPERSAND);

        return parts.map(function (param, idx) {
            if (param === E && idx !== (parts.length - 1)) {
                return { key: null, value: null };
            }

            var index = (typeof param === STRING) ? param.indexOf(EQUALS) : -1,
                paramObj = {};

            // this means that there was no value for this key (not even blank, so we store this info)
            // and the value is set to null
            if (index < 0) {
                paramObj.key = param.substr(0, param.length);
                paramObj.value = null;
            }
            else {
                paramObj.key = param.substr(0, index);
                paramObj.value = param.substr(index + 1);
            }

            return paramObj;
        });
    }

    return [];
};

/**
 * Stringifies a query string, from an array of parameters
 *
 * @todo: This function is only used in legacyEncoder. Remove it when we remove
 *        the legacyEncoder
 *
 * @param {Object[]} parameters array of query param objects (ex. [{key: 'k1', value: 'v1'}])
 * @returns {string} stringified query params (ex. k1=v1&k2=v2)
 */
stringifyQueryParams = function (parameters) {
    return parameters ? parameters.map(function (param) {
        var key = param.key,
            value = param.value;

        if (value === undefined) {
            return E;
        }

        if (key === null) {
            key = E;
        }

        if (value === null) {
            return legacyEncoder.encode(key);
        }

        return legacyEncoder.encode(key) + EQUALS + legacyEncoder.encode(value);
    }).join(AMPERSAND) : E;
};

/**
 * Percent encode a character with given code.
 *
 * @param {Number} c character code of the character to encode
 * @returns {String} percent encoding of given character
 */
percentEncode = function (c) {
    var hex = c.toString(16).toUpperCase();
    (hex.length === 1) && (hex = ZERO + hex);
    return PERCENT + hex;
};

/**
 * Checks if character at given index in the buffer is already percent encoded or not.
 *
 * @param {Buffer} buffer buffer to check the character from
 * @param {Number} i index of the character to check
 * @returns {Boolean} true if the character is encoded, false otherwise
 */
isPreEncoded = function (buffer, i) {
    // If it is % check next two bytes for percent encode characters
    // looking for pattern %00 - %FF
    return (buffer[i] === 0x25 &&
        (isPreEncodedCharacter(buffer[i + 1]) &&
        isPreEncodedCharacter(buffer[i + 2]))
    );
};

/**
 * Checks if character with given code is valid hexadecimal digit or not.
 *
 * @param {Number} byte character code
 * @returns {Boolean} true if given character is a hexadecimal digit
 */
isPreEncodedCharacter = function (byte) {
    return (byte >= 0x30 && byte <= 0x39) || // 0-9
        (byte >= 0x41 && byte <= 0x46) || // A-F
        (byte >= 0x61 && byte <= 0x66); // a-f
};

/**
 * Checks whether given character should be percent encoded or not for fixture.
 *
 * @param {Number} byte character to check
 * @returns {Boolean} true if the character should be encoded
 */
charactersToPercentEncodeExtra = function (byte) {
    return (byte < 0x23 || byte > 0x7E || // Below # and after ~
        byte === 0x3C || byte === 0x3E || // > and <
        byte === 0x28 || byte === 0x29 || // ( and )
        byte === 0x25 || // %
        byte === 0x27 || // '
        byte === 0x2A // *
    );
};

/**
 * Checks whether given character should be percent encoded or not according to the given escape table.
 *
 * @param {Number} byte character to check
 * @param {Number[]} [escapeTable=[]] escape table to use for encoding
 * @returns {Boolean} true if the character should be encoded
 */
charactersToPercentEncode = function (byte, escapeTable) {
    !escapeTable && (escapeTable = []);

    // Look in escape table if given character is in range of ASCII
    if (byte < 0x80 && byte <= escapeTable.length) { return Boolean(escapeTable[byte]); }

    // don't encode if character is in range of ASCII but not in range of given escapeTable
    if (byte < 0x80) { return false; }

    // Always encode non ASCII characters
    return true;
};

legacyEncoder = {
    /**
     * Percent encode a query string according to RFC 3986.
     *
     * @note: This function is supposed to be used on top of node's inbuilt url encoding
     *       to solve issue https://github.com/nodejs/node/issues/8321
     *
     * @param {String} value string to percent-encode
     * @returns {String} percent-encoded string
     */
    encode: function (value) {
        if (!(value && typeof value === 'string')) { return E; }

        var buffer = Buffer.from(value),
            ret = E,
            i,
            ii;

        for (i = 0, ii = buffer.length; i < ii; ++i) {

            if (charactersToPercentEncodeExtra(buffer[i]) && !isPreEncoded(buffer, i)) {
                ret += percentEncode(buffer[i]);
            }
            else {
                ret += String.fromCodePoint(buffer[i]);
            }
        }

        return ret;
    },

    /**
     * Converts URL string into Node's Url object with encoded values
     *
     * @param {String} urlString string representing a url
     * @returns {Url} Node's Url object
     */
    toNodeUrl: function (urlString) {
        var parsed = url.parse(urlString),
            rawQs = parsed.query,
            qs,
            search,
            path,
            str;

        if (!(rawQs && rawQs.length)) { return parsed; }

        qs = stringifyQueryParams(parseQueryString(rawQs));
        search = QUERY_SEPARATOR + qs;
        path = parsed.pathname + search;

        parsed.query = qs;
        parsed.search = search;
        parsed.path = path;

        str = url.format(parsed);

        // Parse again, because Node does not guarantee consistency of properties
        return url.parse(str);
    }
};

encoder = {
    /**
     * Percent encode a given string according to given escape table.
     *
     * @param {String} value string to percent-encode
     * @param {Number[]} [escapeTable=QUERY_ESCAPE_TABLE] escape table to use for encoding
     * @returns {String} percent-encoded string
     */
    encode: function (value, escapeTable) {
        if (!(value && typeof value === 'string')) { return E; }

        !escapeTable && (escapeTable = QUERY_ESCAPE_TABLE);

        var buffer = Buffer.from(value),
            ret = E,
            i,
            ii;

        for (i = 0, ii = buffer.length; i < ii; ++i) {
            if (charactersToPercentEncode(buffer[i], escapeTable) && !isPreEncoded(buffer, i)) {
                ret += percentEncode(buffer[i]);
            }
            else {
                ret += String.fromCodePoint(buffer[i]);
            }
        }

        return ret;
    },

    /**
     * Does percent-encodeing of username/password for basic auth
     *
     * @param {String} authParam auth parameter to encode
     * @returns {String} percent-encoded auth parameter
     */
    encodeAuth: function (authParam) {
        if (typeof authParam !== STRING) { return E; }

        return encoder.encode(authParam, AUTH_ESCAPE_TABLE);
    },

    /**
     * Does punycode encoding of hostName according to RFC 3492 and RFC 5891
     *
     * @param {String|String[]} hostName unencoded hostname (ex. 'foo.com' or ['foo', 'com'])
     * @returns {String} punycode-encoded hostname
     */
    encodeHost: function (hostName) {
        if (Array.isArray(hostName)) {
            hostName = hostName.join(DOMAIN_SEPARATOR);
        }

        if (typeof hostName !== STRING) {
            return E;
        }

        return domainToASCII(hostName) || hostName;
    },

    /**
     * Encodes url path or individual path segments
     *
     * @param {String|String[]} path unencoded path (ex. '/foo/bar' or ['foo', 'bar'])
     * @returns {String} percent-encoded path
     */
    encodePath: function (path) {
        if (Array.isArray(path) && path.length) {
            path = path.join(PATH_SEPARATOR);
        }

        if (typeof path !== STRING) {
            return E;
        }

        return encoder.encode(path, PATH_ESCAPE_TABLE);
    },

    /**
     * Encodes single query parameter and returns as a string
     *
     * @param {Object|String} param query param to encode (ex. {key:'foo', value:'bar'} or 'key' or 'value')
     * @returns {String} percent-encoded query param (ex. 'foo=bar')
     */
    encodeQueryParam: function (param) {
        if (!param) { return E; }

        if (typeof param === STRING) {
            return encoder.encode(param, QUERY_ESCAPE_TABLE);
        }

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

        key = encoder.encode(key, QUERY_ESCAPE_TABLE);
        value = encoder.encode(value, QUERY_ESCAPE_TABLE);

        return key + EQUALS + value;
    },

    /**
     * Encodes list of query parameters and returns encoded query string
     *
     * @param {Object|Object[]} params query params to encode (ex. [{key:'foo1', value:'bar1'}, ...])
     * @param {Boolean} [ignoreDisabled=false] ignore disabled params if true
     * @returns {String} percent-encoded query string
     */
    encodeQueryParams: function (params, ignoreDisabled) {
        var i,
            ii,
            encoded,
            result = E;

        if (!Array.isArray(params)) {
            if (!(params && typeof params === 'object')) { return E; }

            Object.keys(params).forEach(function (key) {
                if (Array.isArray(params[key])) {
                    params[key].forEach(function (value) {
                        encoded = encoder.encodeQueryParam({ key: key, value: value }, QUERY_ESCAPE_TABLE);
                        result && encoded && (result += AMPERSAND);
                        result += encoded;
                    });
                }
                else {
                    encoded = encoder.encodeQueryParam({ key: key, value: params[key] }, QUERY_ESCAPE_TABLE);
                    result && encoded && (result += AMPERSAND);
                    result += encoded;
                }
            });

            return result;
        }

        for (i = 0, ii = params.length; i < ii; i++) {
            if (ignoreDisabled && params[i].disabled === true) { continue; }

            encoded = encoder.encodeQueryParam(params[i], QUERY_ESCAPE_TABLE);

            result && encoded && (result += AMPERSAND);
            result += encoded;
        }

        return result;
    },

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
            return percentEncode(c.charCodeAt(0));
        });
    },

    /**
     * Does percent-encodeing of url hash
     *
     * @param {String} hash hash to encode
     * @returns {String} percent-encoded hash
     */
    encodeHash: function (hash) {
        if (typeof hash !== STRING) { return E; }

        return encoder.encode(hash, HASH_ESCAPE_TABLE);
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

encoder.legacyEncoder = legacyEncoder;
module.exports = encoder;

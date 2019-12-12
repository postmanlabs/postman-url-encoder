var url = require('url'),
    punycode = require('punycode'),
    sdk = require('postman-collection'),

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
    PROTOCOL_SEPARATOR = '://',

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
     * @type {string}
     */
    STRING = 'string',

    /**
     * @private
     * @const
     * @type {string}
     */
    OBJECT = 'object',

    parseQueryString,
    stringifyQueryParams,

    /**
     * These characters needs to be encoded when encoding auth in URL.
     * [0-31, 127] - non printable ASCII
     * space " # % / < = > ? ^ ` { | }
     *
     * @private
     * @const
     * @type {Number[]}
     */
    defaultAuthEscapeTable = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0 - 15
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 16 - 31
        1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // 32 - 47
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, // 48 - 63
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 64 - 79
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, // 80 - 95
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 96 - 111
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, // 112 - 127
    ],

    /**
     * These characters needs to be encoded when encoding URL path.
     * [0-31, 127] - non printable ASCII
     * space " # % / < = > ? ^ ` { | }
     *
     * @private
     * @const
     * @type {Number[]}
     */
    defaultPathEscapeTable = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0 - 15
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 16 - 31
        1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 32 - 47
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, // 48 - 63
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 64 - 79
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 80 - 95
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 96 - 111
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, // 112 - 127
    ],

    /**
     * These characters needs to be encoded when encoding URL query.
     * [0-31, 127] - non printable ASCII
     * space " # % & ' < = > ? \ ^ `
     *
     * @private
     * @const
     * @type {Number[]}
     */
    defaultQueryEscapeTable = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0 - 15
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 16 - 31
        1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, // 32 - 47
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, // 48 - 63
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 64 - 79
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 80 - 95
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 96 - 111
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // 112 - 127
    ],

    /**
     * These characters needs to be encoded when encoding hash in URL.
     * [0-31, 127] - non printable ASCII
     * space " # % / < = > ? ^ ` { | }
     *
     * @private
     * @const
     * @type {Number[]}
     */
    defaultHashEscapeTable = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0 - 15
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 16 - 31
        1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 32 - 47
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, // 48 - 63
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 64 - 79
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 80 - 95
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 96 - 111
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, // 112 - 127
    ],

    encoder;

/**
 * Parses a query string into an array, preserving parameter values
 * Note: This function is temporary. It will be removed once we implement our own encoding
 *       instead of url.parse().
 *
 * @param string
 * @returns {*}
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

            // this means that there was no value for this key (not even blank, so we store this info) and the value is set
            // to null
            if (index < 0) {
                paramObj.key = param.substr(0, param.length);
                paramObj.value = null;
            } else {
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
 * Note: This function is temporary. It will be removed once we implement our own encoding
 *       instead of url.parse().
 *
 * @param parameters
 * @returns {string}
 */
stringifyQueryParams = function (parameters) {
    return parameters ? parameters.map(function (param) {
            var key = param.key;
            var value = param.value;

            if (value === undefined) {
                return E;
            }

            if (key === null) {
                key = E;
            }

            if (value === null) {
                return encoder.encode(key);
            }

            return encoder.encode(key) + EQUALS + encoder.encode(value);
        }).join(AMPERSAND) : E;
};

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
    charactersToPercentEncodeExtra: function(byte) {
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
     * @param {Number[]} [escapeTable=[]]
     * @returns {Boolean}
     */
    charactersToPercentEncode: function(byte, escapeTable) {
        !escapeTable && (escapeTable = []);

        // Look in escape table if given character is in range of ASCII
        if (byte < 0x80 && byte <= escapeTable.length) { return Boolean(escapeTable[byte]); }

        // don't encode if character is in range of ASCII but not in range of given escapeTable
        if (byte < 0x80) { return false; }

        // Always encode non ASCII characters
        return true;
    },

    /**
     * Percent encode a given string according to RFC 3986.
     *
     * @param {String} value
     * @param {Number[]} [escapeTable=defaultQueryEscapeTable]
     * @returns {String}
     */
    encodeString: function (value, escapeTable) {
        if (!(value && typeof value === 'string')) { return E; }

        !escapeTable && (escapeTable = defaultQueryEscapeTable);

        var buffer = Buffer.from(value),
            ret = E,
            i,
            ii;

        for (i = 0, ii = buffer.length; i < ii; ++i) {

            if (encoder.charactersToPercentEncode(buffer[i], escapeTable) && !encoder.isPreEncoded(buffer, i)) {
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

            if (encoder.charactersToPercentEncodeExtra(buffer[i]) && !encoder.isPreEncoded(buffer, i)) {
                ret += encoder.percentEncode(buffer[i]);
            }
            else {
                ret += String.fromCodePoint(buffer[i]);  // Only works in ES6 (available in Node v4+)
            }
        }

        return ret;
    },

    /**
     * Converts URL string into Node's Url object with encoded values
     *
     * @param {String} url
     * @returns {Url}
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
    },






    /**
     * Does percent-encodeing of username/password for basic auth
     *
     * @param {String} authParam auth parameter to encode
     * @returns {String} encoded auth parameter
     */
    encodeAuth: function (authParam, escapeTable) {
        !escapeTable && (escapeTable = defaultAuthEscapeTable);

        if (typeof authParam !== STRING) { return E; }

        return encoder.encodeString(authParam, escapeTable);
    },

    /**
     * Does punycode encoding of hostName according to RFC 3492 and RFC 5891
     *
     * @param {String|String[]} hostName unencoded hostname (ex. 'foo.com' or ['foo', 'com'])
     * @returns {String} punycode-encoded hostname
     */
    encodeHost: function (hostName) {
        if (!hostName) { return E; }

        if (Array.isArray(hostName)) {
            hostName = hostName.join(DOMAIN_SEPARATOR);
        }

        return punycode.toASCII(hostName);
    },

    /**
     * Encodes url path or individual path segments
     *
     * @param {String|String[]} path Unencoded path (ex. '/foo/bar' or ['foo', 'bar'])
     * @param {Number[]} [escapeTable=defaultPathEscapeTable]
     * @returns {String} percent-encoded path
     */
    encodePath: function (path, escapeTable) {
        !escapeTable && (escapeTable = defaultPathEscapeTable);

        if (typeof path === STRING) {
            path = path.split(PATH_SEPARATOR);
        }

        if (!(Array.isArray(path) && path.length)) {
            return E;
        }

        // encode individual segments of path
        path = path.map(function (segment) {
            return encoder.encodeString(segment, escapeTable);
        });

        return path.join(PATH_SEPARATOR);
    },

    /**
     * Encodes single query parameter and returns as a string
     *
     * @param {Object} param query param to encode (ex. {key:'foo', value:'bar'})
     * @param {Number[]} [escapeTable=defaultQueryEscapeTable]
     * @returns {String} encoded query param (ex. 'foo=bar')
     */
    encodeQueryParam: function (param, escapeTable) {
        if (!param) { return E; }

        !escapeTable && (escapeTable = defaultQueryEscapeTable);

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

        key = encoder.encodeString(key, escapeTable);
        value = encoder.encodeString(value, escapeTable);

        return key + EQUALS + value;
    },

    /**
     * Encodes list of query parameters and returns encoded query string
     *
     * @param {Object|Object[]} params query params to encode (ex. [{key:'foo1', value:'bar1'}, {key:'foo2', value:'bar2'}])
     * @param {Boolean} [ignoreDisabled=false] ignore disabled params if true
     * @param {Number[]} [escapeTable=defaultQueryEscapeTable]
     * @returns {String}
     */
    encodeQueryParams: function (params, ignoreDisabled, escapeTable) {
        !escapeTable && (escapeTable = defaultQueryEscapeTable);

        var result = E;

        if (!Array.isArray(params)) {
            if (!(params && typeof params === 'object')) { return E; }

            Object.keys(params).forEach(function (key) {
                var encoded;

                if (Array.isArray(params[key])) {
                    params[key].forEach(function (value) {
                        encoded = encoder.encodeQueryParam({ key: key, value: value }, escapeTable);
                        result && encoded && (result += AMPERSAND);
                        result += encoded;
                    });
                }
                else {
                    encoded = encoder.encodeQueryParam({ key: key, value: params[key] }, escapeTable);
                    result && encoded && (result += AMPERSAND);
                    result += encoded;
                }
            });

            return result;
        }

        params.forEach(function (param) {
            if (ignoreDisabled && param.disabled === true) { return; }

            var encoded = encoder.encodeQueryParam(param, escapeTable);

            result && encoded && (result += AMPERSAND);
            result += encoded;
        });

        return result;
    },

    /**
     * Does percent-encodeing of url hash
     *
     * @param {String} hash hash to encode
     * @returns {String} encoded hash
     */
    encodeHash: function (hash, escapeTable) {
        !escapeTable && (escapeTable = defaultHashEscapeTable);

        if (typeof hash !== STRING) { return E; }

        return encoder.encodeString(hash, escapeTable);
    },

    /**
     * Converts URL string into Node's Url object with encoded values
     *
     * @param {PostmanUrl|String} url Url to create Node URL object from
     * @returns {Url} Node's Url object
     */
    toNodeUrlWHATWG: function (url) {
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

        if (typeof url === STRING) {
            url = new sdk.Url(url);
        }

        if (!(url && typeof url === OBJECT)) {
            return nodeUrl;
        }

        if (url.protocol) {
            // remove '://' from end of protocol if it is there
            nodeUrl.protocol = url.protocol.replace(/:\/\/$/, E).toLowerCase();
            nodeUrl.href = nodeUrl.protocol + PROTOCOL_SEPARATOR;
            nodeUrl.protocol = nodeUrl.protocol + COLON;
        }

        if (url.auth) {
            nodeUrl.auth = encoder.encodeAuth(url.auth.user || E, defaultAuthEscapeTable);
            url.auth.password &&
                (nodeUrl.auth += COLON + encoder.encodeAuth(url.auth.password, defaultAuthEscapeTable));
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.auth + AUTH_CREDENTIALS_SEPARATOR;
        }

        if (url.host) {
            nodeUrl.hostname = encoder.encodeHost(url.getHost()).toLowerCase();
            nodeUrl.host = nodeUrl.hostname;
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.hostname;
        }

        if (url.port) {
            nodeUrl.port = url.port.toString();
            nodeUrl.host = (nodeUrl.hostname || E) + COLON + nodeUrl.port;
            nodeUrl.href = (nodeUrl.href || E) + COLON + nodeUrl.port;
        }

        if (url.path) {
            nodeUrl.pathname = encoder.encodePath(url.getPath(), defaultPathEscapeTable);
            nodeUrl.path = nodeUrl.pathname;
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.pathname;
        }

        if (url.query && url.query.count()) {
            nodeUrl.query = encoder.encodeQueryParams(url.query.all(), true, defaultQueryEscapeTable);
            nodeUrl.search = QUERY_SEPARATOR + nodeUrl.query;
            nodeUrl.path = (nodeUrl.pathname || E) + nodeUrl.search;
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.search;
        }

        if (url.hash) {
            nodeUrl.hash = SEARCH_SEPARATOR + encoder.encodeHash(url.hash, defaultHashEscapeTable);
            nodeUrl.href = (nodeUrl.href || E) + nodeUrl.search;
        }

        return nodeUrl;
    }
};

module.exports = encoder;

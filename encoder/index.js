/** @module encoder */

/**
 * @fileoverview
 * This module determines which of the reserved characters in the different
 * URL components should be percent-encoded and which can be safely used.
 *
 * The generic URI syntax consists of a hierarchical sequence of components
 * referred to as the scheme, authority, path, query, and fragment.
 *
 *      URI         = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
 *
 *      hier-part   = "//" authority path-abempty
 *                  / path-absolute
 *                  / path-rootless
 *                  / path-empty
 *
 *      authority   = [ userinfo "@" ] host [ ":" port ]
 *
 * @see {@link https://tools.ietf.org/html/rfc3986#section-2}
 * @see {@link https://tools.ietf.org/html/rfc3986#section-3}
 */

const url = require('url'),

    encodeSet = require('./encode-set'),

    /** @type module:encoder/percent-encode~encode */
    percentEncode = require('./percent-encode').encode,

    /** @type module:encoder/percent-encode~encodeCharCode */
    percentEncodeCharCode = require('./percent-encode').encodeCharCode,

    /** @type module:encoder/encode-set~EncodeSet */
    EncodeSet = encodeSet.EncodeSet,

    PATH_ENCODE_SET = encodeSet.PATH_ENCODE_SET,
    QUERY_ENCODE_SET = encodeSet.QUERY_ENCODE_SET,
    USERINFO_ENCODE_SET = encodeSet.USERINFO_ENCODE_SET,
    FRAGMENT_ENCODE_SET = encodeSet.FRAGMENT_ENCODE_SET,

    E = '',
    EQUALS = '=',
    AMPERSAND = '&',
    STRING = 'string',
    OBJECT = 'object',

    PATH_SEPARATOR = '/',
    DOMAIN_SEPARATOR = '.',

    /**
     * Returns the Punycode ASCII serialization of the domain.
     *
     * @note `url.domainToASCII` returns empty string for invalid domain.
     *
     * @todo Remove `punycode` dependency on Node version >= 6.13.0.
     *  For backward compatibility, fallback to `punycode` as url.domainToASCII.
     *
     * @private
     * @function
     * @param {String} domain domain name
     * @returns {String} punycode encoded domain name
     */
    domainToASCII = typeof url.domainToASCII === 'function' ?
        // use faster internal method
        url.domainToASCII :
        // else, lazy load `punycode` dependency
        require('punycode').toASCII;

/**
 * Returns the Punycode ASCII serialization of the domain.
 *
 * @note Returns input hostname on invalid domain.
 *
 * @example
 * // returns 'xn--fiq228c.com'
 * encodeHost('中文.com')
 *
 * // returns 'xn--48jwgn17gdel797d.com'
 * encodeHost(['郵便屋さん', 'com'])
 *
 * // returns '127.0.0.1'
 * encodeHost('127.1')
 *
 * // returns 'xn--iñvalid.com'
 * encodeHost('xn--iñvalid.com')
 *
 * @param {String|String[]} hostName Unencoded hostname (ex. 'foo.com' or ['foo', 'com'])
 * @returns {String} Punycode-encoded hostname
 */
function encodeHost (hostName) {
    if (Array.isArray(hostName)) {
        hostName = hostName.join(DOMAIN_SEPARATOR);
    }

    if (typeof hostName !== STRING) {
        return E;
    }

    // return input host name if `domainToASCII` returned an empty string
    return domainToASCII(hostName) || hostName;
}

/**
 * Encodes URL path or individual path segments.
 *
 * @example
 * // returns 'foo/bar&baz'
 * encodePath('foo/bar&baz')
 *
 * // returns 'foo/bar/%20%22%3C%3E%60%23%3F%7B%7D'
 * encodePath(['foo', 'bar', ' "<>\`#?{}'])
 *
 * @param {String|String[]} path Unencoded path (ex. '/foo/bar' or ['foo', 'bar'])
 * @returns {String} Percent-encoded path
 */
function encodePath (path) {
    if (Array.isArray(path) && path.length) {
        path = path.join(PATH_SEPARATOR);
    }

    if (typeof path !== STRING) {
        return E;
    }

    return percentEncode(path, PATH_ENCODE_SET);
}

/**
 * Encodes URL userinfo (username / password) fields.
 *
 * @example
 * // returns 'info~%20%22%3C%3E%60%23%3F%7B%7D%2F%3A%3B%3D%40%5B%5C%5D%5E%7C'
 * encodeAuth('info~ "<>`#?{}/:;=@[\\]^|')
 *
 * @param {String} param Parameter to encode
 * @returns {String} Percent-encoded parameter
 */
function encodeUserInfo (param) {
    if (typeof param !== STRING) {
        return E;
    }

    return percentEncode(param, USERINFO_ENCODE_SET);
}

/**
 * Encodes URL fragment identifier or hash.
 *
 * @example
 * // returns 'fragment#%20%22%3C%3E%60'
 * encodeHash('fragment# "<>`')
 *
 * @param {String} fragment fragment to encode
 * @returns {String} Percent-encoded fragment
 */
function encodeFragment (fragment) {
    if (typeof fragment !== STRING) {
        return E;
    }

    return percentEncode(fragment, FRAGMENT_ENCODE_SET);
}

/**
 * Encodes single query parameter and returns as a string.
 *
 * @example
 * // returns 'param%20%22%23%26%27%3C%3D%3E'
 * encodeQueryParam('param "#&\'<=>')
 *
 * // returns 'foo=bar'
 * encodeQueryParam({ key: 'foo', value: 'bar' })
 *
 * @param {Object|String} param Query param to encode
 * @returns {String} Percent-encoded query param
 */
function encodeQueryParam (param) {
    if (!param) {
        return E;
    }

    if (typeof param === STRING) {
        return percentEncode(param, QUERY_ENCODE_SET);
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

    key = percentEncode(key, QUERY_ENCODE_SET);
    value = percentEncode(value, QUERY_ENCODE_SET);

    return key + EQUALS + value;
}

/**
 * Encodes list of query parameters and returns encoded query string.
 *
 * @example
 * // returns 'foo=bar&=foo%26bar'
 * encodeQueryParams([{ key: 'foo', value: 'bar' }, { value: 'foo&bar' }])
 *
 * // returns 'q1=foo&q2=bar&q2=baz'
 * encodeQueryParams({ q1: 'foo', q2: ['bar', 'baz'] })
 *
 * @param {Object|Object[]} params Query params to encode
 * @returns {String} Percent-encoded query string
 */
function encodeQueryParams (params) {
    var i,
        ii,
        encoded,
        result = E;

    if (!(params && typeof params === OBJECT)) {
        return E;
    }

    // handle array of query params
    if (Array.isArray(params)) {
        for (i = 0, ii = params.length; i < ii; i++) {
            // @todo Add helper in PropertyList to filter disabled QueryParam
            if (!params[i] || params[i].disabled === true) {
                continue;
            }

            encoded = encodeQueryParam(params[i]);

            result && encoded && (result += AMPERSAND);
            result += encoded;
        }

        return result;
    }

    // handle object with query params
    Object.keys(params).forEach(function (key) {
        // { key: ['value1', 'value2', 'value3'] }
        if (Array.isArray(params[key])) {
            params[key].forEach(function (value) {
                encoded = encodeQueryParam({ key, value });
                result && encoded && (result += AMPERSAND);
                result += encoded;
            });
        }
        // { key: 'value' }
        else {
            encoded = encodeQueryParam({ key, value: params[key] });
            result && encoded && (result += AMPERSAND);
            result += encoded;
        }
    });

    return result;
}

module.exports = {
    // URL components
    encodeHost,
    encodePath,
    encodeUserInfo,
    encodeFragment,
    encodeQueryParam,
    encodeQueryParams,

    // Percent Encode Set
    EncodeSet,

    // Utilities
    percentEncode,
    percentEncodeCharCode
};

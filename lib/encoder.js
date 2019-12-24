const url = require('url'),

    PES = require('./percent-encode-set'),
    percentEncode = require('./percent-encode').encode,

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
     * @param {String} domain domain name
     * @returns {String} punycode encoded domain name
     */
    domainToASCII = typeof url.domainToASCII === 'function' ?
        url.domainToASCII : require('punycode').toASCII;

/**
 * Encodes single query parameter and returns as a string
 *
 * @private
 * @param {Object|String} param query param to encode (ex. {key:'foo', value:'bar'} or 'key' or 'value')
 * @returns {String} percent-encoded query param (ex. 'foo=bar')
 */
function encodeQueryParam (param) {
    if (!param) {
        return E;
    }

    if (typeof param === STRING) {
        return percentEncode(param, PES.QUERY_ENCODE_SET);
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

    key = percentEncode(key, PES.QUERY_ENCODE_SET);
    value = percentEncode(value, PES.QUERY_ENCODE_SET);

    return key + EQUALS + value;
}

module.exports = {
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

        // return original host name if `domainToASCII` returned an empty string
        return domainToASCII(hostName) || hostName;
    },

    /**
     * Does percent-encodeing of username/password for basic auth
     *
     * @param {String} authParam auth parameter to encode
     * @returns {String} percent-encoded auth parameter
     */
    encodeAuth: function (authParam) {
        if (typeof authParam !== STRING) {
            return E;
        }

        return percentEncode(authParam, PES.USERINFO_ENCODE_SET);
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

        return percentEncode(path, PES.PATH_ENCODE_SET);
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
            if (!(params && typeof params === OBJECT)) {
                return E;
            }

            Object.keys(params).forEach(function (key) {
                if (Array.isArray(params[key])) {
                    params[key].forEach(function (value) {
                        encoded = encodeQueryParam({ key: key, value: value });
                        result && encoded && (result += AMPERSAND);
                        result += encoded;
                    });
                }
                else {
                    encoded = encodeQueryParam({ key: key, value: params[key] });
                    result && encoded && (result += AMPERSAND);
                    result += encoded;
                }
            });

            return result;
        }

        for (i = 0, ii = params.length; i < ii; i++) {
            if (ignoreDisabled && params[i].disabled === true) {
                continue;
            }

            encoded = encodeQueryParam(params[i]);

            result && encoded && (result += AMPERSAND);
            result += encoded;
        }

        return result;
    },

    /**
     * Does percent-encodeing of url hash
     *
     * @param {String} hash hash to encode
     * @returns {String} percent-encoded hash
     */
    encodeHash: function (hash) {
        if (typeof hash !== STRING) { return E; }

        return percentEncode(hash, PES.FRAGMENT_ENCODE_SET);
    }
};

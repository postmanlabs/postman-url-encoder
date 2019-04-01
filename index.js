var punycode = require('punycode'),

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
    ];

module.exports = {

    percentEncode: function(c) {
        var hex = c.toString(16).toUpperCase();
        (hex.length === 1) && (hex = ZERO + hex);
        return PERCENT + hex;
    },

    isPreEncoded: function(buffer, i) {
    // If it is % check next two bytes for percent encode characters
    // looking for pattern %00 - %FF
        return (buffer[i] === 0x25 &&
            (this.isPreEncodedCharacter(buffer[i + 1]) &&
             this.isPreEncodedCharacter(buffer[i + 2]))
          );
    },

    isPreEncodedCharacter: function(byte) {
        return (byte >= 0x30 && byte <= 0x39) ||  // 0-9
           (byte >= 0x41 && byte <= 0x46) ||  // A-F
           (byte >= 0x61 && byte <= 0x66);     // a-f
    },

    charactersToPercentEncodeForFixture: function(byte) {
        return (byte < 0x23 || byte > 0x7E || // Below # and after ~
            byte === 0x3C || byte === 0x3E || // > and <
            byte === 0x28 || byte === 0x29 || // ( and )
            byte === 0x25 || // %
            byte === 0x27 || // '
            byte === 0x2A    // *
        );
    },

    charactersToPercentEncode: function(byte) {
        if (byte < 0x80) return !Boolean(noEscape[byte]);

        return true;
    },

    /**
     * Percent encode a query string according to RFC 3986.
     * Note: This function is supposed to be used on top of node's inbuilt url encoding
     *       to solve issue https://github.com/nodejs/node/issues/8321
     *
     * @param value
     * @returns {String}
     */
    encode: function (value) {
        if (!value) { return ''; }

        var buffer = new Buffer(value),
            ret = '',
            i;

        for (i = 0; i < buffer.length; ++i) {

            if (this.charactersToPercentEncodeForFixture(buffer[i]) && !this.isPreEncoded(buffer, i)) {
                ret += this.percentEncode(buffer[i]);
            }
            else {
                ret += String.fromCodePoint(buffer[i]);  // Only works in ES6 (available in Node v4+)
            }
        }

        return ret;
    },

    /**
     * Percent encode a given string according to RFC 3986.
     *
     * @param value
     * @returns {String}
     */
    encodeString: function (value) {
        if (!value) { return ''; }

        var buffer = new Buffer(value),
            ret = '',
            i;

        for (i = 0; i < buffer.length; ++i) {

            if (this.charactersToPercentEncode(buffer[i]) && !this.isPreEncoded(buffer, i)) {
                ret += this.percentEncode(buffer[i]);
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
     * @param hostName
     * @returns {String}
     */
    encodeHostName: function (hostName) {
        if (typeof hostName !== 'string') { return; }

        return punycode.toASCII(hostName);
    }
};

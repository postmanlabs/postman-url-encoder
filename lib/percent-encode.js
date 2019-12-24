const PES = require('./percent-encode-set'),
    EncodeSet = PES.EncodeSet,
    QUERY_ENCODE_SET = PES.QUERY_ENCODE_SET,
    E = '',
    ZERO = '0',
    PERCENT = '%',
    STRING = 'string';

/**
 * Checks if character with given code is valid hexadecimal digit or not.
 *
 * @private
 * @param {Number} byte
 * @returns {Boolean}
 */
function isPreEncodedCharacter (byte) {
    return (byte >= 0x30 && byte <= 0x39) || // 0-9
        (byte >= 0x41 && byte <= 0x46) || // A-F
        (byte >= 0x61 && byte <= 0x66); // a-f
}

/**
 * Checks if character at given index in the buffer is already percent encoded or not.
 *
 * @private
 * @param {Buffer} buffer buffer to check the character from
 * @param {Number} i index of the character to check
 * @returns {Boolean} true if the character is encoded, false otherwise
 */
function isPreEncoded (buffer, i) {
    // if it is % check next two bytes for percent encode characters
    // looking for pattern %00 - %FF
    return buffer[i] === 0x25 && // %
        isPreEncodedCharacter(buffer[i + 1]) &&
        isPreEncodedCharacter(buffer[i + 2]);
}

/**
 * Percent encode a character with given code.
 *
 * @param {Number} code
 * @returns {String}
 */
function encodeSingle (code) {
    var hex = code.toString(16).toUpperCase();
    (hex.length === 1) && (hex = ZERO + hex);

    return PERCENT + hex;
}

/**
 * Percent-encode the UTF-8 encoding of the given string.
 *
 * @param {String} input string to percent-encode
 * @param {EncodeSet} [encodeSet=QUERY_ENCODE_SET] EncodeSet to use for encoding
 * @returns {String} percent-encoded string
 */
function encode (input, encodeSet) {
    if (!(input && typeof input === STRING)) {
        return E;
    }

    // defaults to QUERY_ENCODE_SET
    if (!EncodeSet.isEncodeSet(encodeSet)) {
        encodeSet = QUERY_ENCODE_SET;
    }

    var buffer = Buffer.from(input),
        output = E,
        i,
        ii;

    for (i = 0, ii = buffer.length; i < ii; ++i) {
        // encode if char code present in encodeSet
        // also, avoid double encoding
        if (encodeSet.has(buffer[i]) && !isPreEncoded(buffer, i)) {
            output += encodeSingle(buffer[i]);
        }
        // or, append string from char code
        else {
            output += String.fromCodePoint(buffer[i]);
        }
    }

    return output;
}

module.exports = {
    encode,
    encodeSingle
};

/** @module encoder/encode-set */

/**
 * @fileoverview
 * Represents a set of characters / bytes that should be percent-encoded.
 *
 * Different characters need to be encoded in different parts of an URL.
 * For example, a literal ? question mark in an URL’s path would indicate the
 * start of the query string. A question mark meant to be part of the path
 * therefore needs to be percent-encoded.
 * In the query string however, a question mark does not have any special
 * meaning and does not need to be percent-encoded.
 *
 * A few sets are defined in this module.
 * Use the {@link EncodeSet} class to define different ones.
 *
 * @see {@link https://url.spec.whatwg.org/#simple-encode-set}
 */

/**
 * A character (String), or character code (Number).
 *
 * @typedef {String|Number} Char
 */

/**
 * A Set or Array of {@link Char}(s).
 *
 * @typedef {Set.<Char>|Array.<Char>} CharSet
 */

const STRING = 'string',
    QUERY_ENCODE_CHARS = [' ', '"', '#', '&', '\'', '<', '=', '>'],
    FRAGMENT_EXTEND_CHARS = [' ', '"', '<', '>', '`'],
    PATH_EXTEND_CHARS = ['#', '?', '{', '}'],
    USERINFO_EXTEND_CHARS = ['/', ':', ';', '=', '@', '[', '\\', ']', '^', '|'];

/**
 * Returns a number representing the UTF-16 code unit value of the character.
 *
 * @private
 * @param {Char} char Character or character code
 * @returns {Number} Character code
 */
function charCode (char) {
    const code = (typeof char === STRING) ?
        // get char code from string
        char.charCodeAt(0) :
        // or, normalize char code using double Bitwise NOT
        // Refer: https://jsperf.com/truncating-decimals
        ~~char;

    // ensure UTF-16 range [0, 0xFFFF]
    return (code >= 0 && code <= 0xFFFF) ? code : 0;
}

/**
 * Extends the EncodeSet with the given characters.
 *
 * @note Mutates the input EncodeSet.
 *
 * @private
 * @param {EncodeSet} encodeSet Instance of EncodeSet
 * @param {CharSet} chars Character set to extend
 * @returns {EncodeSet} Given EncodeSet
 */
function extendEncodeSet (encodeSet, chars) {
    // check if the input characters are iterable or not
    if (!(chars && typeof chars.forEach === 'function')) {
        return encodeSet;
    }

    chars.forEach(function (char) {
        encodeSet.add(char);
    });

    return encodeSet;
}

/**
 * Represents a set of characters / bytes that should be percent-encoded.
 *
 * @constructor
 * @param {CharSet} chars Character set to encode
 */
function EncodeSet (chars) {
    /**
     * Stores char codes for characters to encode.
     *
     * @protected
     */
    this._set = new Set();

    // extend this set with input characters
    extendEncodeSet(this, chars);
}

/**
 * Appends a new character to the EncodeSet.
 *
 * @example
 * const xyzEncodeSet = new EncodeSet(['x', 'y', 'z'])
 *
 * xyzEncodeSet
 *  .add('X')
 *  .add(89) // Y
 *  .add(0x5a) // Z
 *
 * @param {Char} char Character or character code
 * @returns {EncodeSet} Current EncodeSet
 */
EncodeSet.prototype.add = function (char) {
    this._set.add(charCode(char));

    // chaining
    return this;
};

/**
 * Returns a boolean asserting whether the given char code will be encoded in
 * the EncodeSet or not.
 *
 * @note Always encode control characters. [U+0000, U+001F] AND (U+007E, ∞)
 *
 * @example
 * const tildeEncodeSet = new EncodeSet(['~'])
 *
 * // returns true
 * tildeEncodeSet.has('~'.charCodeAt(0))
 *
 * // returns false
 * tildeEncodeSet.has(65) // A
 *
 * // returns true
 * tildeEncodeSet.has(31) // \u001f (control character)
 *
 * @param {Number} code Character code
 * @returns {Boolean} Returns true if the character with the specified char code
 * exists in the EncodeSet; otherwise false
 */
EncodeSet.prototype.has = function (code) {
    // encode control characters
    if (code <= 0x1F || code > 0x7E) {
        return true;
    }

    // encode if present in the set
    if (this._set.has(code)) {
        return true;
    }

    // don't encode
    return false;
};

/**
 * Creates a copy of the current EncodeSet.
 *
 * @example
 * const set1 = new EncodeSet(['<', '>'])
 * const set1Copy = set1.clone().add('=')
 *
 * @returns {EncodeSet} New EncodeSet instance
 */
EncodeSet.prototype.clone = function () {
    return new EncodeSet(this._set);
};

/**
 * Creates a new EncodeSet by extending the input EncodeSet with additional
 * characters.
 *
 * @example
 * const fooEncodeSet = new EncodeSet(['f', 'o'])
 * const foobarEncodeSet = EncodeSet.extend(fooEncodeSet, new Set(['b', 'a', 'r']))
 *
 * @param {EncodeSet} encodeSet Instance of EncodeSet
 * @param {CharSet} chars Character set to encode
 * @returns {EncodeSet} Copy of given `encodeSet` with extended `chars`
 * @throws {TypeError} Argument `encodeSet` must be of type {@link EncodeSet}
 */
EncodeSet.extend = function (encodeSet, chars) {
    if (!EncodeSet.isEncodeSet(encodeSet)) {
        throw new TypeError('Argument `encodeSet` must be EncodeSet');
    }

    // extend the cloned encodeSet to avoid mutations
    return extendEncodeSet(encodeSet.clone(), chars);
};

/**
 * Determines whether the input value is EncodeSet or not.
 *
 * @example
 * // returns true
 * EncodeSet.isEncodeSet(new EncodeSet([40, 41]))
 *
 * // returns false
 * EncodeSet.isEncodeSet(new Set([28, 05]))
 *
 * @param {*} value The value to be tested
 * @returns {Boolean} true if the given value is EncodeSet; otherwise, false
 */
EncodeSet.isEncodeSet = function (value) {
    return Boolean(value) && (value instanceof EncodeSet);
};

var

    /**
     * The C0 control percent-encode set are the C0 controls and all code points
     * greater than U+007E (~).
     *
     * @const
     * @type {EncodeSet}
     * @see {@link https://url.spec.whatwg.org/#c0-control-percent-encode-set}
     */
    C0_CONTROL_ENCODE_SET = new EncodeSet(),

    /**
     * The fragment percent-encode set is the C0 control percent-encode set and
     * U+0020 SPACE, U+0022 ("), U+003C (<), U+003E (>), and U+0060 (`).
     *
     * @const
     * @type {EncodeSet}
     * @see {@link https://url.spec.whatwg.org/#fragment-percent-encode-set}
     */
    FRAGMENT_ENCODE_SET = EncodeSet.extend(C0_CONTROL_ENCODE_SET, FRAGMENT_EXTEND_CHARS),

    /**
     * The path percent-encode set is the fragment percent-encode set and
     * U+0023 (#), U+003F (?), U+007B ({), and U+007D (}).
     *
     * @const
     * @type {EncodeSet}
     * @see {@link https://url.spec.whatwg.org/#path-percent-encode-set}
     */
    PATH_ENCODE_SET = EncodeSet.extend(FRAGMENT_ENCODE_SET, PATH_EXTEND_CHARS),

    /**
     * The userinfo percent-encode set is the path percent-encode set and
     * U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B ([),
     * U+005C (\), U+005D (]), U+005E (^), and U+007C (|).
     *
     * @const
     * @type {EncodeSet}
     * @see {@link https://url.spec.whatwg.org/#userinfo-percent-encode-set}
     */
    USERINFO_ENCODE_SET = EncodeSet.extend(PATH_ENCODE_SET, USERINFO_EXTEND_CHARS),

    /**
     * The query percent-encode set is the C0 control percent-encode set and
     * U+0020 SPACE, U+0022 ("), U+0023 (#), U+0026 (&), U+0027 ('), U+003C (<),
     * U+003D (=), and U+003E (>).
     *
     * @const
     * @type {EncodeSet}
     */
    QUERY_ENCODE_SET = new EncodeSet(QUERY_ENCODE_CHARS);

module.exports = {
    // EncodeSet class
    EncodeSet,

    // Constants
    PATH_ENCODE_SET,
    QUERY_ENCODE_SET,
    FRAGMENT_ENCODE_SET,
    USERINFO_ENCODE_SET,
    C0_CONTROL_ENCODE_SET
};

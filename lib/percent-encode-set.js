const QUERY_EXTEND_CHARS = [' ', '"', '#', '&', '\'', '<', '=', '>'], // @todo why ' = &
    FRAGMENT_EXTEND_CHARS = [' ', '"', '<', '>', '`'],
    PATH_EXTEND_CHARS = ['#', '?', '{', '}'],
    USERINFO_EXTEND_CHARS = ['/', ':', ';', '=', '@', '[', '\\', ']', '^', '|'];

/**
 * Returns a number representing the UTF-16 code unit value of the character.
 *
 * @private
 * @param {String|Number} char
 * @returns {Number|Null}
 */
function charCode (char) {
    var code = (typeof char === 'string') ? char.charCodeAt(0) : Number(char);

    return Number.isFinite(code) ? code : null;
}

/**
 * Extends the EncodeSet with the given characters.
 *
 * @note Mutates the input EncodeSet.
 *
 * @private
 * @param {EncodeSet} encodeSet
 * @param {Set|String[]|Number[]} chars
 * @returns {EncodeSet}
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
 * @note Always encode control characters. [U+0000, U+001F] AND (U+007E, ∞)
 *
 * @constructor
 * @param {Set|String[]|Number[]} chars
 * @see {@link https://url.spec.whatwg.org/#simple-encode-set}
 */
function EncodeSet (chars) {
    this.set = new Set();

    // extend this set with input characters
    extendEncodeSet(this, chars);
}

/**
 * Appends a new character to the EncodeSet.
 *
 * @param {String|Number} char
 * @returns {EncodeSet}
 */
EncodeSet.prototype.add = function (char) {
    var code = charCode(char);

    if (code !== null) {
        this.set.add(code);
    }

    return this; // chaining
};

/**
 * Returns a boolean asserting whether the given char code will be encoded in
 * the EncodeSet or not.
 *
 * @param {Number} code
 * @returns {Boolean}
 */
EncodeSet.prototype.has = function (code) {
    // encode control characters
    if (code <= 0x1F || code > 0x7E) {
        return true;
    }

    // encode if present in the set
    if (this.set.has(code)) {
        return true;
    }

    // don't encode
    return false;
};

/**
 * Creates a new EncodeSet by extending the input EncodeSet with additional
 * characters.
 *
 * @param {EncodeSet} encodeSet
 * @param {Set|String[]|Number[]} chars
 * @returns {EncodeSet}
 */
EncodeSet.extend = function (encodeSet, chars) {
    if (!EncodeSet.isEncodeSet(encodeSet)) {
        throw new TypeError('Invalid EncodeSet instance');
    }

    // clone encodeSet to avoid mutations
    encodeSet = new EncodeSet(encodeSet.set);

    // extend encodeSet with input characters
    return extendEncodeSet(encodeSet, chars);
};

/**
 * Determines whether the input value is EncodeSet or not.
 *
 * @param {*} input
 * @returns {Boolean}
 */
EncodeSet.isEncodeSet = function (input) {
    return Boolean(input) && (input instanceof EncodeSet);
};

var QUERY_ENCODE_SET = new EncodeSet(QUERY_EXTEND_CHARS),

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
    USERINFO_ENCODE_SET = EncodeSet.extend(PATH_ENCODE_SET, USERINFO_EXTEND_CHARS);

module.exports = {
    EncodeSet,
    PATH_ENCODE_SET,
    QUERY_ENCODE_SET,
    FRAGMENT_ENCODE_SET,
    USERINFO_ENCODE_SET
};

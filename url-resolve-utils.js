const EMPTY = '',
    PROTOCOL_SEPARATOR = '//',
    AUTH_SEPARATOR = '@',
    PATH_SEPARATOR = '/',
    CURRENT_DIRECTORY = '.',
    PARENT_DIRECTORY = '..';

/**
 * Removes an element at specified index from given array.
 * This function modifies the original array.
 *
 * @param {Array} list array to remove element from
 * @param {Number} index index of element to remove
 */
function spliceOne (list, index) {
    for (; index + 1 < list.length; index++) {
        list[index] = list[index + 1];
    }

    list.pop();
}

/**
 * Returns root URL from given URL object.
 * root URL = protocol + auth + host
 *
 * @param {Object} base Url object
 * @returns {String} root URL
 */
function getRootUrl (base) {
    var result = EMPTY;

    if (base.protocol) {
        result += base.protocol + PROTOCOL_SEPARATOR;
    }

    if (base.auth) {
        result += base.auth + AUTH_SEPARATOR;
    }

    if (base.host) {
        result += base.host;
    }

    return result;
}

/**
 * Returns base path from given URL object.
 * base path = pathname without last path segment
 *
 * @param {Object} base Url object
 * @returns {String} base URL
 */
function getBasePath (base) {
    var path = base.pathname.split(PATH_SEPARATOR);

    // remove last segment of path
    path = path.slice(0, path.length - 1);

    path = path.join(PATH_SEPARATOR);

    // always add trailing '/' in base path
    (!path.endsWith(PATH_SEPARATOR)) && (path += PATH_SEPARATOR);

    return path;
}

/**
 * Traverse the path of given URL and resolves segments like '.' and '..'
 *
 * @param {String} path url string
 * @returns {String} url with resolved path
 */
function traversePath (path) {
    if (!path) { return EMPTY; }

    var i,
        segment,
        up = 0;

    // remove leading '/' from path
    path.startsWith(PATH_SEPARATOR) && (path = path.slice(1));

    path = path.split(PATH_SEPARATOR);

    for (i = path.length - 1; i >= 0; i--) {
        segment = path[i];

        if (segment === CURRENT_DIRECTORY) {
            spliceOne(path, i);
        }
        else if (segment === PARENT_DIRECTORY) {
            spliceOne(path, i);
            up++;
        }
        else if (up) {
            spliceOne(path, i);
            up--;
        }
    }

    return PATH_SEPARATOR + path.join(PATH_SEPARATOR);
}

module.exports = {
    spliceOne,
    getRootUrl,
    getBasePath,
    traversePath
};

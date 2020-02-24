var _ = require('lodash'),
    expect = require('chai').expect,
    encoder = require('../..'),
    testCases = require('../fixtures/url-resolve-list');

describe('url-resolve', function () {
    it('should resolve all URLs properly', function () {
        _.forEach(testCases, function (test) {
            var base = encoder.toNodeUrl(test.base),
                resolved = encoder.resolveNodeUrl(base, test.relative);

            expect(resolved).to.eql(test.resolved);
        });
    });
});

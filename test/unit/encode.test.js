const expect = require('chai').expect,
    encode = require('../../').encode,
    percentEncodeCharCode = require('../../encoder').percentEncodeCharCode;

describe('.encode', function () {
    describe('with TextEncoder', function () {
        it('should percent-encode C0 control codes', function () {
            var i,
                char;

            for (i = 0; i < 32; i++) {
                char = String.fromCharCode(i);
                expect(encode(char)).to.equal(percentEncodeCharCode(i));
            }

            char = String.fromCharCode(127);
            expect(encode(char)).to.equal(percentEncodeCharCode(127));
        });

        it('should percent-encode SPACE, ("), (#), (\'), (<), and (>)', function () {
            var i,
                char,
                encoded,
                chars = [],
                expected = [' ', '"', '#', '\'', '<', '>'];

            for (i = 32; i < 127; i++) {
                char = String.fromCharCode(i);
                encoded = encode(char);

                if (char !== encoded) {
                    chars.push(char);
                    expect(encoded).to.equal(percentEncodeCharCode(i));
                }
            }

            expect(chars).to.eql(expected);
        });

        it('should percent-encode unicode characters', function () {
            expect(encode('𝌆й你ス')).to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should percent-encode 4-byte unicode characters', function () {
            expect(encode('𝌆')).to.eql('%F0%9D%8C%86');
        });

        it('should handle unpaired surrogates', function () {
            expect(encode('\uD800')).to.eql('%EF%BF%BD');
        });

        it('should not double encode characters', function () {
            expect(encode('key:%F0%9F%8D%AA')).to.equal('key:%F0%9F%8D%AA');
        });

        it('should return empty string on invalid input types', function () {
            expect(encode()).to.equal('');
            expect(encode(null)).to.equal('');
            expect(encode(undefined)).to.equal('');
            expect(encode(NaN)).to.equal('');
            expect(encode(true)).to.equal('');
            expect(encode(1234)).to.equal('');
            expect(encode(Function)).to.equal('');
            expect(encode(['key', 'value'])).to.equal('');
        });
    });

    describe('without TextEncoder', function () {
        let oldTextEncoder;

        before(function () {
            oldTextEncoder = global.TextEncoder;
            global.TextEncoder = undefined;
        });

        after(function () {
            global.TextEncoder = oldTextEncoder;
        });

        it('should percent-encode C0 control codes', function () {
            var i,
                char;

            for (i = 0; i < 32; i++) {
                char = String.fromCharCode(i);
                expect(encode(char)).to.equal(percentEncodeCharCode(i));
            }

            char = String.fromCharCode(127);
            expect(encode(char)).to.equal(percentEncodeCharCode(127));
        });

        it('should percent-encode SPACE, ("), (#), (\'), (<), and (>)', function () {
            var i,
                char,
                encoded,
                chars = [],
                expected = [' ', '"', '#', '\'', '<', '>'];

            for (i = 32; i < 127; i++) {
                char = String.fromCharCode(i);
                encoded = encode(char);

                if (char !== encoded) {
                    chars.push(char);
                    expect(encoded).to.equal(percentEncodeCharCode(i));
                }
            }

            expect(chars).to.eql(expected);
        });

        it('should percent-encode unicode characters', function () {
            expect(encode('𝌆й你ス')).to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should percent-encode 4-byte unicode characters', function () {
            expect(encode('𝌆')).to.eql('%F0%9D%8C%86');
        });

        it('should handle unpaired surrogates', function () {
            expect(encode('\uD800')).to.eql('%EF%BF%BD');
        });

        it('should not double encode characters', function () {
            expect(encode('key:%F0%9F%8D%AA')).to.equal('key:%F0%9F%8D%AA');
        });

        it('should return empty string on invalid input types', function () {
            expect(encode()).to.equal('');
            expect(encode(null)).to.equal('');
            expect(encode(undefined)).to.equal('');
            expect(encode(NaN)).to.equal('');
            expect(encode(true)).to.equal('');
            expect(encode(1234)).to.equal('');
            expect(encode(Function)).to.equal('');
            expect(encode(['key', 'value'])).to.equal('');
        });
    });
});

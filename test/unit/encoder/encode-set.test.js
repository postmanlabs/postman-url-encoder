const expect = require('chai').expect,
    encodeSet = require('../../../encoder/encode-set'),

    charCode = function (char) {
        return char.charCodeAt(0);
    },

    doesExtends = function (originalSet, extendedSet) {
        var i;

        for (i = 0; i < 128; i++) {
            if (originalSet.has(i) && !extendedSet.has(i)) {
                return false;
            }
        }

        return true;
    };

describe('encoder/encode-set', function () {
    const EncodeSet = encodeSet.EncodeSet,
        DEFAULT_SET = new EncodeSet();

    describe('EncodeSet', function () {
        describe('constructor', function () {
            it('should accept array input', function () {
                var set = new EncodeSet(['X', 89, 0x5a]);

                expect(set.has(charCode('X'))).to.be.true;
                expect(set.has(charCode('Y'))).to.be.true;
                expect(set.has(charCode('Z'))).to.be.true;
            });

            it('should accept any iterable input', function () {
                var set = new EncodeSet(new Set(['X', 89, 0x5a]));

                expect(set.has(charCode('X'))).to.be.true;
                expect(set.has(charCode('Y'))).to.be.true;
                expect(set.has(charCode('Z'))).to.be.true;
            });

            it('should handle invalid input types', function () {
                expect(new EncodeSet(null)).to.eql(DEFAULT_SET);
                expect(new EncodeSet(undefined)).to.eql(DEFAULT_SET);
                expect(new EncodeSet(NaN)).to.eql(DEFAULT_SET);
                expect(new EncodeSet('abcd')).to.eql(DEFAULT_SET);
                expect(new EncodeSet(1234)).to.eql(DEFAULT_SET);
                expect(new EncodeSet(true)).to.eql(DEFAULT_SET);
                expect(new EncodeSet({ forEach: true })).to.eql(DEFAULT_SET);
            });
        });

        describe('#add', function () {
            it('should accept string (character) as input', function () {
                var set = new EncodeSet();

                set.add('&');
                set.add('1');
                set.add('ab');

                expect(set.has(charCode('&'))).to.be.true;
                expect(set.has(charCode('1'))).to.be.true;
                expect(set.has(charCode('a'))).to.be.true;
                expect(set.has(charCode('b'))).to.be.false;
                expect(set).to.not.eql(DEFAULT_SET);
            });

            it('should accept number (character code) as input', function () {
                var set = new EncodeSet();

                set.add(123);

                expect(set.has(123)).to.be.true;
                expect(set).to.not.eql(DEFAULT_SET);
            });

            it('should support method chaining', function () {
                var set = new EncodeSet();

                expect(set.add()).to.be.an.instanceof(EncodeSet);

                expect(set.add(123).has(123)).to.be.true;
                expect(set).to.not.eql(DEFAULT_SET);
            });

            it('should ignore any fractional digits on number input', function () {
                var set = new EncodeSet();

                set.add(50.1)
                    .add(99.999)
                    .add(100.00);

                expect(set.has(50)).to.be.true;
                expect(set.has(99)).to.be.true;
                expect(set.has(100)).to.be.true;
                expect(set).to.not.eql(DEFAULT_SET);
            });

            it('should ignore non-ASCII character codes', function () {
                var set = new EncodeSet();

                set.add(128)
                    .add(-100)
                    .add(9999999)
                    .add('û')
                    .add('😎');

                // no change
                expect(set).to.eql(DEFAULT_SET);
            });

            it('should ignore invalid input types', function () {
                var set = new EncodeSet();

                // casts to 0
                set.add()
                    .add(null)
                    .add(undefined)
                    .add(NaN)
                    .add(false)
                    .add(Infinity)
                    .add(-Infinity)
                    .add(Function);

                // casts to 1
                set.add(true);

                // no change
                expect(set).to.eql(DEFAULT_SET);
            });
        });

        describe('#has', function () {
            it('should return true if the char code exists in the EncodeSet', function () {
                var set = new EncodeSet(['@']);

                expect(set.has(charCode('@'))).to.be.true;
            });

            it('should return false if the char code does not exists in the EncodeSet', function () {
                var set = new EncodeSet(['@']);

                expect(set.has(charCode('#'))).to.be.false;
            });

            it('should always return true for C0 control codes', function () {
                var set = new EncodeSet(),
                    flag = 1,
                    i;

                for (i = 0; i < 32; i++) {
                    flag &= set.has(i);
                }

                flag &= set.has(127);

                expect(flag).to.equal(1);
            });

            it('should return false for printable ASCII codes (default set)', function () {
                var set = new EncodeSet(),
                    flag = 0,
                    i;

                for (i = 32; i < 127; i++) {
                    flag |= set.has(i);
                }

                expect(flag).to.equal(0);
            });

            it('should return false on invalid input types', function () {
                var set = new EncodeSet();

                expect(set.has()).to.be.false;
                expect(set.has(null)).to.be.false;
                expect(set.has(undefined)).to.be.false;
                expect(set.has(true)).to.be.false;
                expect(set.has(false)).to.be.false;
                expect(set.has(NaN)).to.be.false;
                expect(set.has(Function)).to.be.false;
            });

            it('should return true for char codes not in ASCII range', function () {
                var set = new EncodeSet();

                expect(set.has(Infinity)).to.be.true;
                expect(set.has(-Infinity)).to.be.true;
                expect(set.has(-0)).to.be.true;
                expect(set.has(Number.MAX_SAFE_INTEGER)).to.be.true;
                expect(set.has(-Number.MAX_SAFE_INTEGER)).to.be.true;
            });
        });

        describe('#clone', function () {
            it('should create a copy of the current EncodeSet', function () {
                var set1 = new EncodeSet([50, 60]),
                    set2 = set1.clone();

                expect(set2).to.be.an.instanceof(EncodeSet);
                expect(set2).to.eql(set1);

                // mutation
                set2.add(70);

                expect(set2.has(50)).to.be.true;
                expect(set2.has(60)).to.be.true;
                expect(set2.has(70)).to.be.true;
                expect(set1.has(70)).to.be.false;
                expect(set1).to.not.eql(set2);
            });
        });

        describe('#seal', function () {
            it('should seals the current EncodeSet to prevent mutations', function () {
                var set = new EncodeSet().seal();

                expect(set.add(60).has(60)).to.be.false;
                expect(set._sealed).to.be.true;
                expect(set._set).to.eql(DEFAULT_SET._set);
            });
        });

        describe('.extend', function () {
            it('should creates a new EncodeSet by extending the input EncodeSet', function () {
                var setA = new EncodeSet(['A']),
                    setAB = EncodeSet.extend(setA, ['B']);

                expect(setA.has(65)).to.be.true;
                expect(setA.has(66)).to.be.false;
                expect(setAB.has(65)).to.be.true;
                expect(setAB.has(66)).to.be.true;
            });

            it('should not mutate the input EncodeSet', function () {
                var set = new EncodeSet(),
                    set1 = EncodeSet.extend(set);

                set1.add(65);

                expect(set.has(65)).to.be.false;
                expect(set1.has(65)).to.be.true;
                expect(set).to.eql(DEFAULT_SET);
            });

            it('should throw TypeError if the input is not an EncodeSet instance', function () {
                expect(function () { EncodeSet.extend(); }).to.throw(TypeError);
                expect(function () { EncodeSet.extend(new Set()); }).to.throw(TypeError);
            });
        });

        describe('.isEncodeSet', function () {
            it('should return true if the given value is an EncodeSet', function () {
                var set = new EncodeSet();

                expect(EncodeSet.isEncodeSet(set)).to.be.true;
            });

            it('should return false if the given value is not an EncodeSet', function () {
                expect(EncodeSet.isEncodeSet()).to.be.false;
                expect(EncodeSet.isEncodeSet({})).to.be.false;
                expect(EncodeSet.isEncodeSet(true)).to.be.false;
                expect(EncodeSet.isEncodeSet(new Set([65]))).to.be.false;
            });
        });
    });

    describe('C0_CONTROL_ENCODE_SET', function () {
        const SET = encodeSet.C0_CONTROL_ENCODE_SET;

        it('should be sealed EncodeSet', function () {
            expect(SET).to.be.an.instanceof(EncodeSet);
            expect(SET.add(65).has(65)).to.be.false;
        });

        it('should encode C0 control codes', function () {
            var i,
                flag = 1;

            for (i = 0; i < 32; i++) {
                flag &= SET.has(i);
            }

            flag &= SET.has(127);

            expect(flag).to.equal(1);
        });

        it('should not encode printable ASCII codes [32, 126]', function () {
            var i,
                flag = 0;

            for (i = 32; i < 127; i++) {
                flag |= SET.has(i);
            }

            expect(flag).to.equal(0);
        });
    });

    describe('FRAGMENT_ENCODE_SET', function () {
        const SET = encodeSet.FRAGMENT_ENCODE_SET;

        it('should be sealed EncodeSet', function () {
            expect(SET).to.be.an.instanceof(EncodeSet);
            expect(SET.add(65).has(65)).to.be.false;
        });

        it('should extend C0_CONTROL_ENCODE_SET', function () {
            expect(doesExtends(encodeSet.C0_CONTROL_ENCODE_SET, SET)).to.be.true;
        });

        it('should be extend by SPACE, ("), (<), (>), and (`)', function () {
            var i,
                chars = [],
                expected = [' ', '"', '<', '>', '`'];

            for (i = 32; i < 127; i++) {
                SET.has(i) && chars.push(String.fromCharCode(i));
            }

            expect(chars).to.have.all.members(expected);
        });
    });

    describe('PATH_ENCODE_SET', function () {
        const SET = encodeSet.PATH_ENCODE_SET;

        it('should be sealed EncodeSet', function () {
            expect(SET).to.be.an.instanceof(EncodeSet);
            expect(SET.add(65).has(65)).to.be.false;
        });

        it('should extend FRAGMENT_ENCODE_SET', function () {
            expect(doesExtends(encodeSet.FRAGMENT_ENCODE_SET, SET)).to.be.true;
        });

        it('should be extend by (#), (?), ({), and (})', function () {
            var i,
                chars = [],
                expected = ['#', '?', '{', '}'];

            for (i = 32; i < 127; i++) {
                SET.has(i) && chars.push(String.fromCharCode(i));
            }

            expect(chars).to.include.members(expected);
        });
    });

    describe('USERINFO_ENCODE_SET', function () {
        const SET = encodeSet.USERINFO_ENCODE_SET;

        it('should be sealed EncodeSet', function () {
            expect(SET).to.be.an.instanceof(EncodeSet);
            expect(SET.add(65).has(65)).to.be.false;
        });

        it('should extend PATH_ENCODE_SET', function () {
            expect(doesExtends(encodeSet.PATH_ENCODE_SET, SET)).to.be.true;
        });

        it('should be extend by (/), (:), (;), (=), (@), ([), (\\), (]), (^), and (|)', function () {
            var i,
                chars = [],
                expected = ['/', ':', ';', '=', '@', '[', '\\', ']', '^', '|'];

            for (i = 32; i < 127; i++) {
                SET.has(i) && chars.push(String.fromCharCode(i));
            }

            expect(chars).to.include.members(expected);
        });
    });

    describe('QUERY_ENCODE_SET', function () {
        const SET = encodeSet.QUERY_ENCODE_SET;

        it('should be sealed EncodeSet', function () {
            expect(SET).to.be.an.instanceof(EncodeSet);
            expect(SET.add(65).has(65)).to.be.false;
        });

        it('should extend C0_CONTROL_ENCODE_SET', function () {
            expect(doesExtends(encodeSet.C0_CONTROL_ENCODE_SET, SET)).to.be.true;
        });

        it('should be extend by SPACE, ("), (#), (&), (\'), (<), (=), and (>)', function () {
            var i,
                chars = [],
                expected = [' ', '"', '#', '&', '\'', '<', '=', '>'];

            for (i = 32; i < 127; i++) {
                SET.has(i) && chars.push(String.fromCharCode(i));
            }

            expect(chars).to.include.members(expected);
        });
    });
});

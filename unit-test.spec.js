var expect = require('expect.js'),
    urlEncoder = require('./index.js');

describe('Url Encoding fix of node\'s bug', function () {

  describe('Encode' , function() {
    it('%', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?charwithPercent=%foo');
      expect(encodedUrl).to.equal('http://foo.bar.com?charwithPercent=%25foo');
    });

    it('( and )', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?a=foo(a)');
      expect(encodedUrl).to.equal('http://foo.bar.com?a=foo%28a%29');
    });

    it('Space', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?a=foo bar');
      expect(encodedUrl).to.equal('http://foo.bar.com?a=foo%20bar');
    });

    it('multibyte character "𝌆"', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?multibyte=𝌆');
      expect(encodedUrl).to.equal('http://foo.bar.com?multibyte=%F0%9D%8C%86');
    });

    it('Russian charcters "обязательный"', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?a=обязательный');
      expect(encodedUrl).to.equal('http://foo.bar.com?a=%D0%BE%D0%B1%D1%8F%D0%B7%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9');
    });

    it('Chinese charcters "你好"', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?a=你好');
      expect(encodedUrl).to.equal('http://foo.bar.com?a=%E4%BD%A0%E5%A5%BD');
    });

    it('Japanese charcters "ハローポストマン"', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?a=ハローポストマン');
      expect(encodedUrl).to.equal('http://foo.bar.com?a=%E3%83%8F%E3%83%AD%E3%83%BC%E3%83%9D%E3%82%B9%E3%83%88%E3%83%9E%E3%83%B3');
    });

    it('Partial Russian charcters "Hello Почтальон"', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?a=Hello Почтальон');
      expect(encodedUrl).to.equal('http://foo.bar.com?a=Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD');
    });
  });

  describe('Do not encode' , function() {

    it('/, &, =, :, ?, +', function () {
        var encodedUrl = urlEncoder.encode('http://foo.bar.com?a=b&c=d&e=f+g');
        expect(encodedUrl).to.equal('http://foo.bar.com?a=b&c=d&e=f+g');
    });

    it('[ and ]', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?a[0]=foo&a[1]=bar');
      expect(encodedUrl).to.equal('http://foo.bar.com?a[0]=foo&a[1]=bar');
    });

    it('pre encoded text( must avoid double encoding) - "email=foo%2Bbar%40domain.com"', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?email=foo%2Bbar%40domain.com');
      expect(encodedUrl).to.equal('http://foo.bar.com?email=foo%2Bbar%40domain.com');
    });

    it('pre-encoded multibyte character - "multibyte=%F0%9D%8C%86"', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?multibyte=%F0%9D%8C%86');
      expect(encodedUrl).to.equal('http://foo.bar.com?multibyte=%F0%9D%8C%86');
    });

    it('pre-encoded russian text - "a=Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD"', function () {
      var encodedUrl = urlEncoder.encode('http://foo.bar.com?a=Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD');
      expect(encodedUrl).to.equal('http://foo.bar.com?a=Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD');
    });
  });

});

describe('Url encoding of string', function () {

  describe('Encode' , function() {
    it('!"#$%&\'()*+,=?[]{}<>/', function () {
      var encodedString = urlEncoder.encodeString('!"#$%&\'()*+,=?[]{}<>/');
      expect(encodedString).to.equal('%21%22%23%24%25%26%27%28%29%2A%2B%2C%3D%3F%5B%5D%7B%7D%3C%3E%2F');
    });

    it('Space', function () {
      var encodedString = urlEncoder.encodeString(' ');
      expect(encodedString).to.equal('%20');
    });

    it('multibyte character "𝌆"', function () {
      var encodedString = urlEncoder.encodeString('𝌆');
      expect(encodedString).to.equal('%F0%9D%8C%86');
    });

    it('Russian charcters "обязательный"', function () {
      var encodedString = urlEncoder.encodeString('обязательный');
      expect(encodedString).to.equal('%D0%BE%D0%B1%D1%8F%D0%B7%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9');
    });

    it('Chinese charcters "你好"', function () {
      var encodedString = urlEncoder.encodeString('你好');
      expect(encodedString).to.equal('%E4%BD%A0%E5%A5%BD');
    });

    it('Japanese charcters "ハローポストマン"', function () {
      var encodedString = urlEncoder.encodeString('ハローポストマン');
      expect(encodedString).to.equal('%E3%83%8F%E3%83%AD%E3%83%BC%E3%83%9D%E3%82%B9%E3%83%88%E3%83%9E%E3%83%B3');
    });

    it('Partial Russian charcters "Hello Почтальон"', function () {
      var encodedString = urlEncoder.encodeString('Hello Почтальон');
      expect(encodedString).to.equal('Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD');
    });
  });

  describe('Do not encode' , function() {

    it('pre encoded text( must avoid double encoding) - "foo%2Bbar%40domain"', function () {
      var encodedString = urlEncoder.encodeString('foo%2Bbar%40domain');
      expect(encodedString).to.equal('foo%2Bbar%40domain');
    });

    it('pre-encoded multibyte character - "%F0%9D%8C%86"', function () {
      var encodedString = urlEncoder.encodeString('%F0%9D%8C%86');
      expect(encodedString).to.equal('%F0%9D%8C%86');
    });

    it('pre-encoded russian text - "Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD"', function () {
      var encodedString = urlEncoder.encodeString('Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD');
      expect(encodedString).to.equal('Hello%20%D0%9F%D0%BE%D1%87%D1%82%D0%B0%D0%BB%D1%8C%D0%BE%D0%BD');
    });
  });

});

describe('Hostname Encoding', function () {

  describe('Encode', function () {

    it('domain with unicode text - "こんにちは.郵便配達員.com"', function () {
      var encodedHostName = urlEncoder.encodeHostName('こんにちは.郵便配達員.com');
      expect(encodedHostName).to.equal('xn--28j2a3ar1p.xn--wtqy8jqx5dmsazn.com');
    });

  });

  describe('Do not encode', function () {

    it('domain with only ASCII text - "getpostman.com"', function () {
      var encodedHostName = urlEncoder.encodeHostName('getpostman.com');
      expect(encodedHostName).to.equal('getpostman.com');
    });

    it('pre-encoded domain with unicode text - "xn--28j2a3ar1p.xn--wtqy8jqx5dmsazn.com"', function () {
      var encodedHostName = urlEncoder.encodeHostName('xn--28j2a3ar1p.xn--wtqy8jqx5dmsazn.com');
      expect(encodedHostName).to.equal('xn--28j2a3ar1p.xn--wtqy8jqx5dmsazn.com');
    });

  });

});

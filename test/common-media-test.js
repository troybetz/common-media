/**
 * Module dependencies
 */

var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquireify')(require);

var noembedResponse = require('./helpers/noembed-response');
var url = 'http://www.youtube.com/watch?v=iEe_eraFWWs';

var container;
var goodEmbedUrlStub;
var badEmbedUrlStub;
var goodWrapEmbedStub;
var badWrapEmbedStub;

describe('common-media', function() {

  beforeEach(function() {

    /**
     * Stub out `embed-url`.
     */
    
    goodEmbedUrlStub = sinon.spy(function(url, container, cb) {
      setTimeout(function() { // simulate async request
        cb(null, noembedResponse);
      }, 0);
    });

    badEmbedUrlStub = sinon.spy(function(url, container, cb) {
      setTimeout(function() {
        cb(new Error('embed failed')); // simulate async request
      }, 0);
    });

    goodWrapEmbedStub = sinon.spy(function(id, provider, cb) {
      cb(null, {});
    });

    badWrapEmbedStub = sinon.spy(function(id, provider, cb) {
      cb(new Error('embed must be an iframe'));
    });

    /**
     * Base element
     */
    
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('initialization', function() {
    it('should throw an error if container doesnt exist', function() {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      assert.throws(
        function() {
          new Media(url);
        },
        /container element must be specified/
      );
    });
  });

  describe('embedding', function() {
    it('should embed a `url`', function() {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);
      assert.ok(goodEmbedUrlStub.calledWith(url));
    });

    it('should emit a `failure` event if embed fails', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': badEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('failure', function(err) {
        assert.ok(/embed failed/.test(err.message));
        done();
      });
    });
  });

  describe('wrapping', function() {
    it('should create an API wrapper', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('ready', function() {
        assert.equal(goodWrapEmbedStub.args[0][1], 'YouTube');
        done();
      });
    });

    it('should emit a `failure` event if wrapping fails', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': badWrapEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('failure', function(err) {
        assert.ok(/embed must be an iframe/.test(err.message));
        done();
      });
    });
  });
});

/**
 * Module dependencies
 */

var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquireify')(require);

var noembedResponse = require('./helpers/noembed-response');
var url = 'http://www.youtube.com/watch?v=iEe_eraFWWs';

var container;
var goodEmbedRequest;
var badEmbedRequest;

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
      var Media = proxyquire('../', {'./lib/embed-url': goodEmbedUrlStub});

      assert.throws(
        function() {
          new Media(url);
        },
        /container element must be specified/
      );
    });
  });

  describe('functionality', function() {
    it('should embed a `url`', function() {
      var Media = proxyquire('../', {'./lib/embed-url': goodEmbedUrlStub});
      var embed = new Media(url, container);
      assert.ok(goodEmbedUrlStub.calledWith(url));
    });

    it('should emit a `failure` event if embed fails', function(done) {
      var Media = proxyquire('../', {'./lib/embed-url': badEmbedUrlStub});
      var embed = new Media(url, container);

      embed.on('failure', function(err) {
        assert.ok(/embed failed/.test(err.message));
        done();
      });
    });
  });
});

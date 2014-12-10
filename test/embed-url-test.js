/**
 * Module dependencies
 */

var assert = require('assert');
var proxyquire = require('proxyquireify')(require);

var noembedResponse = require('./helpers/noembed-response');
var embedHTMLContainer;
var iframe;
var container;
var embedUrl;

describe('embed-url', function() {
  beforeEach(function() {

    container = document.createElement('div');
    document.body.appendChild(container);

    /**
     * Fake html returned from media-embed.
     */

    embedHTMLContainer = document.createElement('div');

    // actual embed
    iframe = document.createElement('iframe');
    iframe.src = 'http://www.youtube.com/embed/bDOYN-6gdRE';

    embedHTMLContainer.appendChild(iframe);

    var mediaEmbedStub = function(url, cb) {
      return cb(null, embedHTMLContainer, noembedResponse);
    };

    /**
     * Magic happens
     */
     
    embedUrl = proxyquire('../lib/embed-url', {
      'media-embed': mediaEmbedStub
    });
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  it('embeds a `url`', function(done) {
    embedUrl(noembedResponse.url, container, function() {
      assert.ok(container.querySelector('iframe'));  
      assert.ok(/bDOYN-6gdRE/.test(container.querySelector('iframe').src));
      done();
    });
  });

  it('adds an id of `media-embed` to the embed', function(done) {
    embedUrl(noembedResponse.url, container, function() {
      assert.equal(container.querySelector('iframe').id, 'media-embed');  
      done();
    });
  });

  it('should return the data used to embed `url`', function(done) {
    embedUrl(noembedResponse.url, container, function(err, data) {
      assert.equal(data, noembedResponse);
      done();
    });;
  });

  it('should return an error if embed fails', function(done) {
    var mediaEmbedStub = function(url, cb) {
      var err = new Error('valid url required for embedding');
      return cb(err);
    };

    var embedUrl = proxyquire('../lib/embed-url', {
      'media-embed': mediaEmbedStub
    });

    embedUrl(noembedResponse.url, container, function(err, data) {
      assert.ok(err !== null);
      assert.ok(/valid url required/.test(err.message));
      done();
    });
  });
});

/**
 * Module dependencies
 */

var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquireify')(require);
var EventEmitter = require('events');

var embedUrlStub;
var wrapEmbedStub;
var removeEmbedStub;
var wrapperStub;
var container;
var Media;
var embed;

describe('common-media', function() {
  beforeEach(function(done) {

    /**
     * Stub out `embed-url`.
     */

    embedUrlStub = {
      good: sinon.spy(function(url, container, cb) {
        setTimeout(function() {
          cb(null, require('./helpers/noembed-response'));
        }, 0);
      }),

      bad: sinon.spy(function(url, container, cb) {
        setTimeout(function() {
          cb(new Error('embed failed'));
        }, 0);
      })
    };

    /**
     * Stub out `wrap-embed`
     */

    wrapEmbedStub = {
      good: sinon.spy(function(id, provider, cb) {
        setTimeout(function() {
          cb(null, wrapperStub);
          wrapperStub.emit('ready');
        });
      }),

      bad: sinon.spy(function(id, provider, cb) {
        cb(new Error('embed must be an iframe'));
      })
    };

    /**
     * Stub out `remove-embed`
     */
    
    removeEmbedStub = sinon.spy();

    /**
     * Stub out internal `wrapper` returned from `wrap-embed`
     */
    
    wrapperStub = new EventEmitter();
    wrapperStub.removeAllListeners = sinon.spy();
    wrapperStub.play = sinon.spy();
    wrapperStub.pause = sinon.spy();
    wrapperStub.destroy = sinon.spy();

    /**
     * Base element
     */

    container = document.createElement('div');
    document.body.appendChild(container);

    /**
     * Default configuration. Best case scenario, everything works.
     */
    
    Media = proxyquire('../', {
      './lib/embed-url': embedUrlStub.good,
      './lib/wrap-embed': wrapEmbedStub.good,
      './lib/remove-embed': removeEmbedStub
    });

    embed = new Media('a valid url', container);
    embed.on('ready', done);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('initialization', function() {
    it('should throw an error if container doesnt exist', function() {
      assert.throws(
        function() {
          new Media('a valid url');
        },
        /container element must be specified/
      );
    });
  });

  describe('destruction', function() {
    beforeEach(function() {
      embed.destroy();
    });

    it('should remove the embed from the page', function() {
      assert.ok(removeEmbedStub.calledWith('media-embed', container));
    });

    it('should unbind all event handlers', function() {
      assert.equal(wrapperStub.removeAllListeners.callCount, 4);
    });

    it('should destroy its `wrapper`', function() {
      assert.ok(wrapperStub.destroy.called);
      assert.equal(embed.wrapper, undefined);
    });

    it('should destroy its `container` reference', function() {
      assert.equal(embed.container, undefined);
    });
  });

  describe('embedding', function() {
    it('should embed a `url`', function() {
      assert.ok(embedUrlStub.good.calledWith('a valid url'));
    });

    it('should emit a `failure` event if embed fails', function(done) {
      Media = proxyquire('../', { './lib/embed-url': embedUrlStub.bad });
      embed = new Media('a valid url', container);

      embed.on('failure', function(err) {
        assert.ok(/embed failed/.test(err.message));
        done();
      });
    });
  });

  describe('wrapping', function() {
    it('should create an API wrapper', function() {
      assert.equal(wrapEmbedStub.good.args[0][1], 'YouTube');
    });

    it('should emit a `failure` event if wrapping fails', function(done) {
      Media = proxyquire('../', {
        './lib/embed-url': embedUrlStub.good,
        './lib/wrap-embed': wrapEmbedStub.bad
      });

      embed = new Media('a valid url', container);

      embed.on('failure', function(err) {
        assert.ok(/embed must be an iframe/.test(err.message));
        done();
      });
    });
  });

  describe('functionality', function() {
    it('should play', function() {
      embed.play();
      assert.ok(wrapperStub.play.called);
    });

    it('should pause', function() {
      embed.pause();
      assert.ok(wrapperStub.pause.called);
    });
  });

  describe('events', function() {
    it('should emit `play` when playing', function(done) {
      embed.on('play', done);
      wrapperStub.emit('play');
    });

    it('should emit `pause` when paused', function(done) {
      embed.on('pause', done);
      wrapperStub.emit('pause');
    });

    it('should emit `end` when finished', function(done) {
      embed.on('end', done);
      wrapperStub.emit('end');
    });
  });
});

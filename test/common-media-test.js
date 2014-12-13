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
  beforeEach(function() {

    /**
     * Stub out `embed-url`.
     */

    embedUrlStub = sinon.spy(function(url, container, cb) {
      cb(null, require('./helpers/noembed-response'));
    });

    /**
     * Stub out `wrap-embed`
     */

    wrapEmbedStub = sinon.spy(function(id, provider, cb) {
      cb(null, wrapperStub);
      wrapperStub.emit('ready');
    });

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
      './lib/embed-url': embedUrlStub,
      './lib/wrap-embed': wrapEmbedStub,
      './lib/remove-embed': removeEmbedStub
    });

    embed = new Media('a valid url', container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('Media(url, container)', function() {
    it('should populate attrs', function() {
      var embed = Media('a valid url', container);
      assert.equal(embed.container, container);
    });
  });

  describe('new Media(url, container)', function() {
    it('should populate attrs', function() {
      assert.equal(embed.container, container);
    });

    it('should throw an error if container doesnt exist', function() {
      assert.throws(
        function() {
          Media('a valid url');
        },
        /container element must be specified/
      );
    });
  });

  describe('Media#load(url)', function() {
    it('should embed a `url`', function() {
      embed.load('another valid url');
      assert.ok(embedUrlStub.calledWith('another valid url'));
    });

    it('should create an API wrapper', function() {
      embed.load('another valid url');
      assert.ok(wrapEmbedStub.calledWith('media-embed'));
    });

    it('should destroy the current API wrapper before loading', function() {
      embed.load('another valid url');

      assert.equal(wrapperStub.removeAllListeners.callCount, 4);
      assert.ok(wrapperStub.destroy.called);
    });

    it('should destroy the current embed before loading', function() {
      embed.load('another valid url');
      assert.ok(removeEmbedStub.calledWith('media-embed', container));
    });
  });

  describe('Media#play()', function() {
    it('should play', function() {
      embed.play();
      assert.ok(wrapperStub.play.called);
    });
  });

  describe('Media#pause()', function() {
    it('should pause', function() {
      embed.pause();
      assert.ok(wrapperStub.pause.called);
    });
  });

  describe('Media#destroy()', function() {
    it('should unbind all event handlers', function() {
      embed.destroy();
      assert.equal(wrapperStub.removeAllListeners.callCount, 4);
    });

    it('should remove the embed from the page', function() {
      embed.destroy();
      assert.ok(removeEmbedStub.calledWith('media-embed', container));
    });

    it('should destroy its `container` reference', function() {
      embed.destroy();
      assert.equal(embed.container, undefined);
    });

    it('should destroy its `wrapper`', function() {
      embed.destroy();
      assert.ok(wrapperStub.destroy.called);
      assert.equal(embed.wrapper, undefined);
    });
  });

  describe('playback events', function() {
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

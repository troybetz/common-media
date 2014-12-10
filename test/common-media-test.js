/**
 * Module dependencies
 */

var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquireify')(require);
var EventEmitter = require('events');

var noembedResponse = require('./helpers/noembed-response');
var url = 'http://www.youtube.com/watch?v=iEe_eraFWWs';

var container;
var goodEmbedUrlStub;
var badEmbedUrlStub;

var wrapperStub;
var goodWrapEmbedStub;
var badWrapEmbedStub;

var removeEmbedStub;

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

    wrapperStub = new EventEmitter();
    wrapperStub.removeAllListeners = sinon.spy();
    wrapperStub.play = sinon.spy();
    wrapperStub.pause = sinon.spy();
    wrapperStub.destroy = sinon.spy();

    goodWrapEmbedStub = sinon.spy(function(id, provider, cb) {
      setTimeout(function() {
        cb(null, wrapperStub);
        wrapperStub.emit('ready');
      });
    });

    badWrapEmbedStub = sinon.spy(function(id, provider, cb) {
      cb(new Error('embed must be an iframe'));
    });

    removeEmbedStub = sinon.spy();

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

  describe('destruction', function() {
    it('should remove an embed from the page', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub,
        './lib/remove-embed': removeEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('ready', function() {
        embed.destroy();
        assert.ok(removeEmbedStub.calledWith('media-embed', container));
        done();
      });
    });

    it('should unbind all event handlers', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub,
        './lib/remove-embed': removeEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('ready', function() {
        embed.destroy();
        assert.equal(wrapperStub.removeAllListeners.callCount, 4);
        done();
      });
    });

    it('should delete its internal state', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub,
        './lib/remove-embed': removeEmbedStub
      });

      var embed = new Media(url, container);
      
      embed.on('ready', function() {
        embed.destroy();
        assert.equal(embed.container, undefined);
        assert.equal(embed.wrapper, undefined);
        done();
      });
    });

    it('should destroy its `wrapper`', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub,
        './lib/remove-embed': removeEmbedStub
      });

      var embed = new Media(url, container);
      
      embed.on('ready', function() {
        embed.destroy();
        assert.ok(wrapperStub.destroy.called);
        done();
      });
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

  describe('functionality', function() {
    it('can play', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('ready', function() {
        embed.play();
        assert.ok(wrapperStub.play.called);
        done();
      });
    });

    it('can pause', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('ready', function() {
        embed.pause();
        assert.ok(wrapperStub.pause.called);
        done();
      });
    });
  });

  describe('events', function() {
    it('should emit `ready` when embed has loaded', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);
      embed.on('ready', done);
    });

    it('should emit `play` when embed is playing', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('ready', function() {
        embed.on('play', done);
        wrapperStub.emit('play');
      });
    });

    it('should emit `pause` when embed is paused', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('ready', function() {
        embed.on('pause', done);
        wrapperStub.emit('pause');
      });
    });

    it('should emit `end` when embed has ended', function(done) {
      var Media = proxyquire('../', {
        './lib/embed-url': goodEmbedUrlStub,
        './lib/wrap-embed': goodWrapEmbedStub
      });

      var embed = new Media(url, container);

      embed.on('ready', function() {
        embed.on('end', done);
        wrapperStub.emit('end');
      });
    });
  });
});

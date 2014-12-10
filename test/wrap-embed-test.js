/**
 * Module dependencies
 */

var assert = require('assert');
var sinon = require('sinon');
var proxyquire = require('proxyquireify')(require);

var YouTube;
var SoundCloud;
var Vimeo;
var wrapEmbed;

describe('wrap-embed', function() {
  beforeEach(function() {
    YouTube = sinon.stub();
    SoundCloud = sinon.stub();
    Vimeo = sinon.stub();

    wrapEmbed = proxyquire('../lib/wrap-embed', {
      'common-youtube': YouTube,
      'common-soundcloud': SoundCloud,
      'common-vimeo': Vimeo
    });
  });

  it('can wrap a YouTube video', function(done) {
    wrapEmbed('media-embed', 'YouTube', function(err, player) {
      assert.ok(!err);
      assert.ok(YouTube.calledWith('media-embed'));
      done();
    });
  });

  it('can wrap a SoundCloud widget', function(done) {
    wrapEmbed('media-embed', 'SoundCloud', function(err, player) {
      assert.ok(!err);
      assert.ok(SoundCloud.calledWith('media-embed'));
      done();
    });
  });

  it('can wrap a Vimeo video', function(done) {
    wrapEmbed('media-embed', 'Vimeo', function(err, player) {
      assert.ok(!err);
      assert.ok(Vimeo.calledWith('media-embed'));
      done();
    });
  });

  it('returns an error if provider isnt supported', function(done) {
    wrapEmbed('media-embed', 'Vine', function(err, player) {
      assert.ok(/provider not supported/.test(err.message));
      done();
    });
  });
});

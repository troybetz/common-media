/**
 * Module dependencies
 */

var EventEmitter = require('events');
var embedUrl = require('./lib/embed-url');
var wrapEmbed = require('./lib/wrap-embed');
var removeEmbed = require('./lib/remove-embed');

/**
 * Expose `Media`
 */

module.exports = Media;

/**
 * Create new `Media`
 *
 * @param {String} url
 * @param {String} container
 */

function Media(url, container) {
  if (!(this instanceof Media)) return new Media(url, container);
  if (!container) throw new Error('container element must be specified.');
  this.container = container;
  this.load(url);
}

/**
 * Mixin events
 */

Media.prototype = new EventEmitter();

/**
 * Load a new `url`.
 * 
 * @param {String} url
 * @api public
 */

Media.prototype.load = function(url) {
  var self = this;
  embedUrl(url, self.container, function(err, data) {
    if (err) throw err;

    self.createWrapper(data.provider_name);
  });
};

/**
 * Play whatever is embedded.
 *
 * @api public
 */

Media.prototype.play = function() {
  this.wrapper.play();
};

/**
 * Pause whatever is embedded.
 *
 * @api public
 */

Media.prototype.pause = function() {
  this.wrapper.pause();
};

/**
 * Remove embed, remove all event handlers and free up internal
 * player for garbage collection.
 *
 * @api public
 */

Media.prototype.destroy = function() {
  this.destroyCurrentEmbed();
  
  delete this.container;
  delete this.wrapper;
};

/** 
 * Destroy current embedded media and its wrapper.
 *
 * @api private
 */

Media.prototype.destroyCurrentEmbed = function() {
  this.destroyWrapper();
  removeEmbed('media-embed', this.container);
};

/**
 * Create a `provider` API wrapper
 *
 * @param {String} provider - type of embed
 * @api private
 */

Media.prototype.createWrapper = function(provider) {
  var self = this;
  wrapEmbed('media-embed', provider, function(err, wrapper) {
    if (err) throw err;

    self.wrapper = wrapper;
    self.bindEvents();
  });
};

/**
 * Reset `wrapper`
 *
 * @api private
 */

Media.prototype.destroyWrapper = function() {
  if (this.wrapper) {
    this.unbindEvents();
    delete this.wrapper;
  }
};

/**
 * Bind playback events to embed
 *
 * @api private
 */

Media.prototype.bindEvents = function() {
  var self = this;

  self.wrapper.on('ready', function() {
    self.emit('ready');
  });

  self.wrapper.on('play', function() {
    self.emit('play');
  });

  self.wrapper.on('pause', function() {
    self.emit('pause');
  });

  self.wrapper.on('end', function() {
    self.emit('end');
  });
};

/**
 * Remove embed event listeners
 */

Media.prototype.unbindEvents = function() {
  this.wrapper.removeAllListeners('ready');
  this.wrapper.removeAllListeners('play');
  this.wrapper.removeAllListeners('pause');
  this.wrapper.removeAllListeners('end');
  this.wrapper.destroy();
};

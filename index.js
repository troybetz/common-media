/**
 * Module dependencies
 */

var EventEmitter = require('events');
var embedUrl = require('./lib/embed-url');
var wrapEmbed = require('./lib/wrap-embed');

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
    if (err) {
      self.emit('failure', err);
      return;
    }

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
 * Create a `provider` API wrapper
 *
 * @param {String} provider - type of embed
 * @api private
 */

Media.prototype.createWrapper = function(provider) {
  var self = this;
  wrapEmbed('media-embed', provider, function(err, wrapper) {
    if (err) {
      self.emit('failure', err);
      return;
    }

    self.wrapper = wrapper;
    self.emit('ready');
  });
};

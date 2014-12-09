/**
 * Module dependencies
 */

var EventEmitter = require('events');
var embedUrl = require('./lib/embed-url');

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
  });
}

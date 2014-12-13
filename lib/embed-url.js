/**
 * Module dependencies
 */

var embed = require('media-embed');

/**
 * Expose `embedUrl`
 */

module.exports = embedUrl;

/**
 * Embed a `url` into a `container`
 *
 * @param {String} url
 * @param {Object} container - iframe will be embedded within this.
 * @param {Function} cb
 */

function embedUrl(url, container, cb) {
  embed(url, function(err, html, data) {
    if (err) return cb(err);

    var iframe = html.querySelector('iframe');
    iframe.id = 'media-embed';
    container.appendChild(iframe);

    cb(null, data);
  });
}

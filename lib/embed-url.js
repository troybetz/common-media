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

    /**
     * These elements are always assumed to exist. Errors regarding 
     * `iframe` will be thrown in `media-embed`, and errors regarding
     * `container` *should* be handled before this is called.
     */
    
    iframe.id = 'media-embed';
    container.appendChild(iframe);

    cb(null, data);
  });
}

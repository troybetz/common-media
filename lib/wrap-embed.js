/**
 * Module dependencies
 */

var YouTube = require('common-youtube');
var SoundCloud = require('common-soundcloud');
var Vimeo = require('common-vimeo');

/**
 * Expose `wrapEmbed`
 */

module.exports = wrapEmbed;

/**
 * Wrap an embedded iframe with the appropriate API
 *
 * @param {String} id
 * @param {String} provider
 * @param {Function} cb
 */

function wrapEmbed(id, provider, cb) {
  var wrapper;
  var error;
  
  switch (provider) {
    case 'YouTube':
      wrapper = new YouTube(id);
      break;
    case 'SoundCloud':
      wrapper = new SoundCloud(id);
      break;

    case 'Vimeo':
      wrapper = new Vimeo(id);
      break;

    default:
      error = new Error('provider not supported');
      break;
  }

  return cb(error, wrapper);
}

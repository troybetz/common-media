/**
 * Expose `removeEmbed`
 */

module.exports = removeEmbed;

/**
 * Remove an embedded iframe from its container.
 *
 * @param {String} id
 * @param {Object} container
 */

function removeEmbed(id, container) {
  var embed = document.getElementById(id);
  if (embed) {
    container.removeChild(embed);
  }
}

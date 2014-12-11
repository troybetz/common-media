/**
 * Module dependencies
 */

var assert = require('assert');
var removeEmbed = require('../lib/remove-embed');

describe('remove-embed', function() {
  beforeEach(function() {
    iframe = document.createElement('iframe');
    iframe.id = 'media-embed';

    container = document.createElement('div');
    container.appendChild(iframe);
    document.body.appendChild(container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  it('should remove an embedded iframe its container', function() {
    removeEmbed('media-embed', container);
    assert.equal(container.querySelector('#media-embed'), null);
  });
});

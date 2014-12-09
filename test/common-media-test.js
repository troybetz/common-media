/**
 * Module dependencies
 */

var assert = require('assert');
var Media = require('../');

var url = 'http://www.youtube.com/watch?v=iEe_eraFWWs';

describe('common-media', function() {
  describe('initialization', function() {
    it('should throw an error if container doesnt exist', function() {
      assert.throws(
        function() {
          new Media(url);
        },
        /container element must be specified/
      );
    });
  });
});

/**
 * Module dependencies
 */

var Media = require('../');

var url = 'https://www.youtube.com/watch?v=a1Y73sPHKxw';
var container = document.querySelector('.media-container');

var player = new Media(url, container);

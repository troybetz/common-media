/**
 * Module dependencies
 */

var Media = require('../');
var pickRandom = require('pick-random');

var urls = [
  'https://soundcloud.com/sylvanesso/coffee',
  'http://vimeo.com/94502406',
  'https://www.youtube.com/watch?v=2g811Eo7K8U'
];

var container = document.querySelector('.media-container');

/**
 * Create new player
 */

window.player = new Media(pickRandom(urls)[0], container);

/**
 * Event handlers
 */

player.on('ready', function() {
  console.log('READY');
});

player.on('play', function() {
  console.log('PLAYING');
});

player.on('pause', function() {
  console.log('PAUSED');
});

player.on('end', function() {
  console.log('ENDED');
});

/**
 * Player controls
 */

var play = document.getElementById('play');
var pause = document.getElementById('pause');
var load = document.getElementById('load');
var destroy = document.getElementById('destroy');

play.addEventListener('click', function() {
  window.player.play();
});

pause.addEventListener('click', function() {
  window.player.pause();
});

load.addEventListener('click', function() {
  window.player.load(pickRandom(urls)[0]);
});

destroy.addEventListener('click', function() {
  window.player.destroy();
  console.log('DESTROYED');
});


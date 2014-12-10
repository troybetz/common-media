/**
 * Module dependencies
 */

var Media = require('../');

var url = 'https://www.youtube.com/watch?v=a1Y73sPHKxw';
var container = document.querySelector('.media-container');

/**
 * Create new player
 */

window.player = new Media(url, container);

/**
 * Event handlers
 */

player.on('ready', function() {
  console.log('READY');
  console.log('player: ', player);

  /**
   * Bind button controls
   */
  
  bindPlay(player);
  bindPause(player);
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

function bindPlay(player) {
  var play = document.getElementById('play');

  play.addEventListener('click', function() {
    player.play();
  });
}

function bindPause(player) {
  var pause = document.getElementById('pause');

  pause.addEventListener('click', function() {
    player.pause();
  });
}

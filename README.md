# common-media

common interface for YouTube, SoundCloud, and Vimeo players

## Installation

```
$ npm install common-media
```

## Usage

```js
var Media = require('common-media');

var embed = new Media('http://www.youtube.com/watch?v=iEe_eraFWWs', 'container-id');
embed.play();

embed.on('end', function() {
  embed.load('https://soundcloud.com/hucci/hitta');
});
```

# License

  MIT

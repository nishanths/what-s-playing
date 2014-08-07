// This is injected when the context menu option "What's Playing Now" is pressed
// Injected by a `grooveshark.js` call

var song = document.getElementById('now-playing-metadata').textContent;
var status = document.getElementById('play-pause').outerHTML;

var playing = /class="\S* \S* playing/.test(status);

if (playing) {
  self.postMessage(song);
}

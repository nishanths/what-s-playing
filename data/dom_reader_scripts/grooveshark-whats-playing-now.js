// This is injected when the context menu option "What's Playing Now" is pressed
// Injected by a `grooveshark.js` call

var metadata = document.getElementById('now-playing-metadata').textContent,
	status = document.getElementById('play-pause').outerHTML,
	is_playing = /class="\S* \S* playing/.test(status);

if (is_playing) {
  self.postMessage(metadata);
}

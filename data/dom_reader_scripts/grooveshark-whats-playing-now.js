var song = document.querySelector('#now-playing-metadata').textContent;
var status = document.querySelector('#play-pause').outerHTML;

var playing = /class="\S* \S* playing/.test(status);

if (playing) {
  self.postMessage(song);
}

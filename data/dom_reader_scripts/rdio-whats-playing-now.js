// Different fetching from how rdio-body-class.js does it
// Less intensive and quicker

var metadata = {
	  song: document.querySelector("a.song_title").textContent,
	  artist: document.querySelector("a.artist_title:nth-child(2)").textContent
	},
	status = document.querySelector('button.play_pause').outerHTML,
	is_playing = /class="\S* playing/.test(status);

if (is_playing) {
  self.postMessage(metadata);
}

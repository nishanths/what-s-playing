var metadata = document.querySelector('.playbackSoundBadge__title').getAttribute('title') || null,
	status = document.querySelector('.playControls__playPauseSkip .playControl') || null,
	is_playing = status && status.getAttribute('title').toString().toLowerCase().indexOf('pause') !== -1; // says "click to pause current" when playing

if (is_playing && metadata) {
	console.log("pos")
	self.postMessage(metadata);
}

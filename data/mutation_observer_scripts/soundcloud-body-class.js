var observer;

var checkExist = setInterval(function() {
    var w = document.querySelector("header.header");
    if (w != null) {
        clearInterval(checkExist);
        doMagic();
   }
}, 100);

function doMagic() { 
    var target = document.querySelector("header.header");
    var options = { attributes: true, childList: true, characterData: true };

    observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (addon_exists) {
              var song = document.querySelector(".playbackSoundBadge__title"),
                  playlist = document.querySelector(".playbackSoundBadge__context"),
                  status = document.querySelector('.playControls__playPauseSkip .playControl') || null,
                  is_playing = status && status.getAttribute('title').toString().toLowerCase().indexOf('pause') !== -1;
          if (is_playing) { self.postMessage( { song: song.getAttribute('title'), playlist: playlist.getAttribute('title') } ); }
        }
      });
    }); 

    observer.observe(target, options); // set up
}

var addon_exists = true;
self.port.on("detach", function() { // to disable posting messages after add-on removal
    addon_exists = false;
});

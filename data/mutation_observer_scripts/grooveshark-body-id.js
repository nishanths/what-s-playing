var target_metadata = document.getElementById('now-playing-metadata'),
    target_play_pause = document.getElementById('play-pause'),
    options = { attributes: true, childList: true, characterData: true };

var observer_metadata = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) { 
    if (addon_exists){ 
      self.postMessage(mutation.target_metadata.textContent);
    }
  });
});

var observer_play_pause = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) { 
    if (addon_exists){
      var started_playing = document.getElementById('play-pause').outerHTML;
      if (/class="\S* \S* playing/.test(started_playing)){
        self.postMessage(target_metadata.textContent);
        console.log("GROOVESHARK BODY ID:" + target_metadata.textContent);
      }
    }
  });
});

var addon_exists = true;

observer_metadata.observe(target_metadata, options); // set up
observer_play_pause.observe(target_play_pause, options);

self.port.on("detach", function() { // to disable posting messages after add-on removal
  addon_exists = false;
});

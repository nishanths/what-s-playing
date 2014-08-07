var target = document.querySelector("div.bottom.player_bottom");
var options = { attributes: true, childList: true, characterData: true };

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) { 
    if (addon_exists) {
      var status = document.querySelector('button.play_pause').outerHTML,
          is_playing = /class="\S* playing/.test(status); // initially Rdio starts paused with the song from last session
      if (is_playing) { self.postMessage(mutation.target.innerHTML); }
    }
  });
}); 

var addon_exists = true;

observer.observe(target, options); // set up

self.port.on("detach", function() { // to disable posting messages after add-on removal
  addon_exists = false;
});

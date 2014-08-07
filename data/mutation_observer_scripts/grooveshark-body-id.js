var target = document.getElementById('now-playing-metadata');
var options = { attributes: true, childList: true, characterData: true };

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) { 
    if (addon_exists){ 
      self.postMessage(mutation.target.textContent);
    }
  });
}); 

var addon_exists = true;

observer.observe(target, options); // set up

self.port.on("detach", function() { // to disable posting messages after add-on removal
  addon_exists = false;
});

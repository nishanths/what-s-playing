var target = document.querySelector('#now-playing-metadata');
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

self.port.on("detach", function() {
  addon_exists = false;
});

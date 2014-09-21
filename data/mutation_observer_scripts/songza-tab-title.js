var target = document.querySelector('head > title');
var options = { attributes: true, childList: true, characterData: true, subtree: true };

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) { 
    if (addon_exists){ 
      self.postMessage(mutation.target.textContent);
      console.log("SONGZA TAB:" + mutation.target.textContent);
    }
  });
});

var addon_exists = true;

observer.observe(target, options); // set up

self.port.on("detach", function() { // to disable posting messages after add-on removal
  addon_exists = false;
});

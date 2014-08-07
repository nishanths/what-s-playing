var target = document.querySelector('head > title');
var options = { attributes: true, childList: true, characterData: true, subtree: true };

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) { 
    if ((mutation.target.textContent != previous_title) && addon_exists){
      previous_title = mutation.target.textContent;
      self.postMessage(mutation.target.textContent);
  	}
  });
});

var previous_title = "";
var addon_exists = true;

observer.observe(target, options); // set up

self.port.on("detach", function() { // to disable posting messages after add-on removal
  addon_exists = false;
});

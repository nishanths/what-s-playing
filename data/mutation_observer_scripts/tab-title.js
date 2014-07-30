var target = document.querySelector('head > title');
var options = { attributes: true, childList: true, characterData: true, subtree: true };

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) { 
    self.postMessage(mutation.target.textContent);
  });
});

observer.observe(target, options); // set up

var target = document.querySelector('#now-playing-metadata');
var options = { attributes: true, childList: true, characterData: true };

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) { 
    self.postMessage(mutation.target.textContent);
  });
}); 

observer.observe(target, options); // set up

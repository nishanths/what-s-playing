// This script is injected by main.js on 'end' -- after all the DOM, CSS, external resources are fully loaded
// So we do have to wait for window.ready here

function titleModified() {
self.postMessage(document.title);
}

// http://stackoverflow.com/questions/2497200/how-to-listen-for-changes-to-the-title-element/2499119#2499119
var titleEl = document.getElementsByTagName("title")[0];
var docEl = document.documentElement;

if (docEl && docEl.addEventListener) {
  docEl.addEventListener("DOMSubtreeModified", function(evt) {
    var t = evt.target;
    if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
        titleModified();
    }
  }, false);
} else {
  document.onpropertychange = function() {
      if (window.event.propertyName == "title") {
          titleModified();
      }
  };
} 

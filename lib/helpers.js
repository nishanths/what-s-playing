var tabs = require("sdk/tabs");
var notifications = require("sdk/notifications");

function notify(message) {
  // console.log("message[2] is" + message[2]);
  notifications.notify({
    title: message[0],
    text: message[1],
    data: typeof message[2] === "undefined" ? undefined : message[2],
    onClick: function(data) { activateTab(data) } // clicking notification switches to song tab
  });
}

function activateTab(id) {
  if (typeof id !== "undefined") {
    // console.log("id is" + id);
    for each (var tab in tabs){ 
      // console.log("for each title:" + tab.title);
      if (tab.id == id) {
        // console.log("tab.id cycled is" + tab.id);
        tab.activate();
        break;
      }
    } 
  }
  else { // not a foolproof implementation, could switch to different music website if multiple open
    for each (var tab in tabs){
      if ((/^https?:\/\/play.spotify.com/.test(tab.url)) && (tab.title[0] == '▶')) {
        tab.activate();
        break;
      } else if ((/^https?:\/\/songza.com/.test(tab.url)) && (tab.title[0] == '♫')){
        tab.activate();
        break;
      } else if (/^https?:\/\/grooveshark.com/.test(tab.url)) {
        tab.activate();
        break;
      } else if (/^(?:https?:\/\/)?(?:www.)?rdio.com/.test(tab.url)) {
        tab.activate();
        break;
      }
    }
  }
}

exports.notify = notify;
exports.activateTab = activateTab;

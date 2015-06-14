var tabs = require("sdk/tabs");
var notifications = require("sdk/notifications");

function notify(message) {
  notifications.notify({
    title: message[0] || "",
    text: message[1] || "",
    data: message[2], 
    onClick: function(data) { activateTab(data) } // clicking notification switches to song tab
  });
}

function activateTab(id) {
  // console.log("id is" + id);
  for each (var tab in tabs){ 
    // console.log("for each title:" + tab.title);
    if (tab.id == id) {
      // console.log("tab.id cycled is" + tab.id);
      tab.activate();
      return;
    }
  } 

  // not a tab id if we made it this far
  // foolproof as long as there isn't more than one of the same website
  for each (var tab in tabs){
    if ((/^https?:\/\/play.spotify.com/.test(tab.url)) && (tab.title[0] == '▶') && (id == "spotify")) {
      tab.activate();
      break;
    } else if ((/^https?:\/\/songza.com/.test(tab.url)) && (tab.title[0] == '♫') && (id == "songza")){
      tab.activate();
      break;
    } else if (/^https?:\/\/grooveshark.com/.test(tab.url) && (id == "grooveshark")) {
      tab.activate();
      break;
    } else if (/^(?:https?:\/\/)?(?:www.)?rdio.com/.test(tab.url) && (id == "rdio")) {
      tab.activate();
      break;
    } else if (/^(?:https?:\/\/)?(?:www.)?soundcloud.com/.test(tab.url) && (id == "soundcloud")) {
      tab.activate();
      break;
    }
  }
}

exports.notify = notify;
exports.activateTab = activateTab;

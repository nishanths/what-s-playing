var notifications = require("sdk/notifications"),
    tabs = require("sdk/tabs");



function notify(message) {
  notifications.notify({
    title: message[0],
    text: message[1],
    data: typeof message[2] === "undefined" ? undefined : message[2],
    onClick: function(id){ // clicking switches to song tab
      for each (var tab in tabs){
        if (typeof id !== "undefined" && tab.id == id) {
          tab.activate();
          break;
        } else {
          if ((/^https?:\/\/play.spotify.com/.test(tab.url)) && (tab.title[0] == '▶')) {
            tab.activate();
            break;
          } else if ((/^https?:\/\/songza.com/.test(tab.url)) && (tab.title[0] == '♫')){
            tab.activate();
            break;
          } else if (/^https?:\/\/grooveshark.com/.test(tab.url)) {
            tab.activate();
            break;
          }
        }
      }
    }
  });
}

exports.notify = notify;

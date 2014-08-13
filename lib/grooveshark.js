var tabs = require("sdk/tabs"),
    helpers = require("./helpers"),
    data = require("sdk/self").data;

function getSongDetails(metadata) {
  var info = /(.+)(?:\sby\s)(.+)/g.exec(metadata);
  return [info[1], info[2]];
}

// function isPlayingSong(tab_title){}
// Has to be done in a script, same result is posted by the script checking for the existence of a 'playing' class

function doTabWork(tab) {
  tab.attach({
    contentScriptFile: [data.url("dom_reader_scripts/grooveshark-whats-playing-now.js")],
    attachTo: ["existing", "top", "frame"],
    onMessage: function(metadata){    // script posts message only if song exists in the playing dashboard and is currently playing
      var song_info = getSongDetails(metadata);
      song_info.push(tab.id); // id for switching to the tab onClicking the notification
      helpers.notify(song_info);
    }  
  });
}

exports.getSongDetails = getSongDetails;
exports.doTabWork = doTabWork;

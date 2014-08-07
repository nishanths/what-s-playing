var tabs = require("sdk/tabs"),
    helpers = require("./helpers"),
    data = require("sdk/self").data;

function getSongDetails(metadata) { // returns an Array [song_name,artist_name]
  if (typeof metadata === "string") {
    var regex = /<a\s.*class="song_title".*?>(.+?)<\/a>.*<a\s.*class="artist_title".*?>(.+?)<\/a>/;
    var info = regex.exec(metadata);
    return [info[1], info[2]];
  } else {  // object passed from rdio-whats-playing-now.js
    return [metadata.song, metadata.artist];
  }
}

function doTabWork(tab) {
  tab.attach({
    contentScriptFile: [data.url("dom_reader_scripts/rdio-whats-playing-now.js")],
    onMessage: function(metadata){    // script posts message only if song exists in the playing dashboard and is currently playing
      var song_info = getSongDetails(metadata);
      song_info.push(tab.id); // id for switching to the tab onClicking the notification
      helpers.notify(song_info);
    }  
  });
}

exports.getSongDetails = getSongDetails;
exports.doTabWork = doTabWork;

var tabs = require("sdk/tabs"),
    helpers = require("./helpers.js");

// Example tab title: ♫ Song by Artist on Indie Pop Playlist ♫ Songza...
function getSongDetails(tab_title) {
  var info = /\S\s(.+?)(?:\sby\s)(.+)(?=\son\b)/g.exec(tab_title);
  return [info[1], info[2]];
}

function isPlayingSong(tab_title) {
  if (tab_title[0] == '♫') { 
    return true;
  } else {
    return false;
  }
}

function iterateTabs() {
  var status = false;
  for each (var tab in tabs) {
    if (/^https?:\/\/songza.com/.test(tab.url) && isPlayingSong(tab.title)) {
      status = true;
      var song_info = getSongDetails(tab.title);
      helpers.notify(song_info);
    } 
  }
  return status;
}

exports.getSongDetails = getSongDetails;
exports.isPlayingSong = isPlayingSong;
exports.iterateTabs = iterateTabs;

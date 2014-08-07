var tabs = require("sdk/tabs"),
    helpers = require("./helpers");

// Example tab title: ♫ Song by Artist on Indie Pop Playlist ♫ Songza...
function getSongDetails(tab_title) {
  var info = /\S\s(.+?)(?:\sby\s)(.+)(?=\son\b)/g.exec(tab_title); // this is OK because if "by" is in the song title, it is always capitalized "By"
  return [info[1], info[2]];
}

function isPlayingSong(tab_title) {
  if (tab_title[0] == '♫') { 
    return true;
  }
  return false;
}

function doTabWork(tab_title) {
  if (isPlayingSong(tab_title)){
    var song_info = getSongDetails(tab_title);
    return song_info;
  }
}

exports.getSongDetails = getSongDetails;
exports.isPlayingSong = isPlayingSong;
exports.doTabWork = doTabWork;

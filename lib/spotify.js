var tabs = require("sdk/tabs"),
    helpers = require("./helpers");

// Example tab title: ▶ 2 Years On (Shame Dream) - How To Dress Well - Spotify
function getSongDetails(tab_title) {
  var info = /\S\s(.+)(?:\s-\s)(.+)(?=\s-\sSpotify\b)/g.exec(tab_title);
  return [info[1], info[2]];
}

function isPlayingSong(tab_title) {
  if (tab_title[0] == '▶') { 
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

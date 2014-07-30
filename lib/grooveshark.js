var tabs = require("sdk/tabs"),
    helpers = require("./helpers.js");

function getSongDetails(metadata) {
  var info = /(.+)(?:\sby\s)(.+)/g.exec(metadata);
  return [info[1], info[2]];
}

function isPlayingSong(tab_title) {
  // To implement – may have to find a class in the DOM that switches when a song is playing and when it's not
}

exports.getSongDetails = getSongDetails;

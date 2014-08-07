var tabs = require("sdk/tabs"),
    helpers = require("./helpers");

function getSongDetails(metadata) {
  var info = /(.+)(?:\sby\s)(.+)/g.exec(metadata);
  return [info[1], info[2]];
}

// function isPlayingSong(tab_title){}
// Has to be done in a script, same result is posted by the script checking for the existence of a 'playing' class

function iterateTabs() {
  var status = false;
  for each (var tab in tabs) {
    if (/^https?:\/\/grooveshark.com/.test(tab.url) {
      tab.attach({
        contentScriptFile: [data.url("dom_reader_scripts/grooveshark-whats-playing-now.js")],
        onMessage: function(data){    // script posts message only if song exists in the playing dashboard and is currently playing
          var extracted = getSongDetails(metadata);
          helpers.notify(extracted);
        }  
      });
    }
  }
}

exports.getSongDetails = getSongDetails;
exports.iterateTabs = iterateTabs;

var tabs = require('sdk/tabs'),
	helpers = require('./helpers'),
	data = require('sdk/self').data;

function getSongDetails(obj) {
	var idx =  obj.song.lastIndexOf(' - ');
	if (idx !== -1) {
		return [ obj.song.substring(0, idx), obj.song.substring(idx + ' - '.length) ];
	}

	return [ obj.song, obj.playlist.substring('Playing from '.length) ];
}

function doTabWork(tab) {
	tab.attach({
    contentScriptFile: [data.url("dom_reader_scripts/soundcloud-whats-playing-now.js")],
    attachTo: ["existing", "top", "frame"],
    onMessage: function(metadata){    // script posts message only if song exists in the playing dashboard and is currently playing
      console.log("Merardata rec");
      var song_info = getSongDetails(metadata);
      song_info.push(tab.id); // id for switching to the tab onClicking the notification
      helpers.notify(song_info);
    }  
  });
}

exports.getSongDetails = getSongDetails;
exports.doTabWork = doTabWork;

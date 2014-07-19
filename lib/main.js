var tabs = require("sdk/tabs"),
    Prefs = require("sdk/simple-prefs"),
    menuItem, // context menu
    songza = require("./songza.js"),
    spotify = require("./spotify.js"),
    helpers = require("./helpers.js");

function createContextMenu() {
  var contextMenu = require("sdk/context-menu");
  menuItem = contextMenu.Item({
    label: "What's Playing Now",
    context: contextMenu.SelectorContext("body"),
    contentScript: 'self.on("click", function(){' + 'self.postMessage();' + '});',
    onMessage: function () {
      displayCurrentSong();
    }
  });
}

// Script injection for window.title change listener
function configureNotifier() {
  var data = require("sdk/self").data;
  var pageMod = require("sdk/page-mod");

  // Spotify
  pageMod.PageMod({
    include: "*.play.spotify.com",
    contentScriptFile: [data.url("title-change.js")], // external script posts every tab title change
    onMessage: function(tab_title){
      if (spotify.isPlayingSong(tab_title)){
        var song_info = spotify.getSongDetails(tab_title);
        helpers.notify(song_info);
      }
    }
  });

  // Songza
  pageMod.PageMod({
    include: "*.songza.com",
    contentScriptFile: [data.url("title-change.js")], // external script posts every tab title change
    onMessage: function(tab_title){
      if (songza.isPlayingSong(tab_title)){
        var song_info = songza.getSongDetails(tab_title);
        helpers.notify(song_info);
      }
    }
  });
}

function destroyContextMenu() {
  menuItem.destroy();
}

function displayCurrentSong (argument) {
  var found = {
    spotify: false,
    songza: false
  };

  found.spotify = spotify.iterateTabs(); // notifies inline
  found.songza = songza.iterateTabs();

  // No song is playing right now
  if (!(found.spotify || found.songza)) {
    helpers.notify(["No Songs Currently Playing","Pump up some tunes and see their details here!"]);
  }
}

function firstRun() {
  tabs.open("http://nishanths.github.io/projects/what-s-playing/");
  Prefs.prefs.firstRun = false;
}

function initialize() {
  configureNotifier();
  Prefs.on("", onPrefChange); // set up preferences listener
  if (Prefs.prefs.contextMenu) { createContextMenu(); } // create menu based on pref
  if (Prefs.prefs.firstRun) { firstRun(); } // open documentation, set firstRun to false
}

function onPrefChange(prefName) {
  switch (prefName) {
    case "contextMenu":
      if (Prefs.prefs.contextMenu) { createContextMenu(); } else { destroyContextMenu(); }
      break;   
  }
}

// Website link button in preferences
Prefs.on("websiteButton", function() {
  tabs.open("http://nishanths.github.io/projects/what-s-playing/");
});

initialize(); // runs on Firefox start up

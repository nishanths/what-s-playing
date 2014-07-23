var tabs = require("sdk/tabs"),
    Prefs = require("sdk/simple-prefs"),
    menuItem, // context menu
    
    // External files
    songza = require("./songza.js"),
    spotify = require("./spotify.js"),
    helpers = require("./helpers.js");

function createContextMenu() {
  var contextMenu = require("sdk/context-menu");
  menuItem = contextMenu.Item({
    label: "What's Playing Now",
    context: contextMenu.PageContext(),
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
        console.log(tab_title);
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
        console.log(tab_title);
        helpers.notify(song_info);
      }
    }
  });
}

function destroyContextMenu() {
  menuItem.destroy();
}

function displayCurrentSong() {
  var found = {
    spotify: false,
    songza: false
  };

  found.spotify = spotify.iterateTabs(); // notifies playing songs inline; returns true if at least one tab was playing
  found.songza = songza.iterateTabs();

  // No song is playing right now
  if (!(found.spotify || found.songza)) {
    helpers.notify(["No Songs Currently Playing","Play some tunes and see their details here."]);
  }
}

function initialize() {
  configureNotifier();
  Prefs.on("", onPrefChange); // set up preferences listener
  if (Prefs.prefs.contextMenu) { createContextMenu(); } // create menu based on pref
}

function onPrefChange(prefName) {
  switch (prefName) {
    case "contextMenu":
      if (Prefs.prefs.contextMenu) { createContextMenu(); } else { destroyContextMenu(); }
      break;   
  }
}

initialize(); // runs on Firefox start up and on installation

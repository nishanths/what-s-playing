var tabs = require("sdk/tabs"),
    Prefs = require("sdk/simple-prefs"),
    menuItem, // context menu
    
    // External files
    grooveshark = require("./grooveshark"),
    songza = require("./songza"),
    spotify = require("./spotify"),
    helpers = require("./helpers");

function createContextMenu() {
  var contextMenu = require("sdk/context-menu");
  menuItem = contextMenu.Item({
    label: "What's Playing Now",
    context: contextMenu.PageContext(),
    contentScript: 'self.on("click", function(){' + 'self.postMessage();' + '});',
    onMessage: function() { displayCurrentSong(); }
  });
}

function configureNotifiers() {
  var data = require("sdk/self").data;
  var pageMod = require("sdk/page-mod");

  // Grooveshark
  pageMod.PageMod({
    include: "*.grooveshark.com",
    contentScriptFile: [data.url("mutation_observer_scripts/grooveshark.js")], // body, #id
    onMessage: function(metadata){
      var extracted = grooveshark.getSongDetails(metadata);
      console.log(metadata);
      helpers.notify(extracted);
    }
  });

  // Songza
  pageMod.PageMod({
    include: "*.songza.com",
    contentScriptFile: [data.url("mutation_observer_scripts/tab-title.js")], // subtree, head > title
    onMessage: function(tab_title){
      if (songza.isPlayingSong(tab_title)){
        var extracted = songza.getSongDetails(tab_title);
        console.log(tab_title);
        helpers.notify(extracted);
      }
    }
  });

  // Spotify
  pageMod.PageMod({
    include: "*.play.spotify.com",
    contentScriptFile: [data.url("mutation_observer_scripts/tab-title.js")], // subtree, head > title
    onMessage: function(tab_title){
      if (spotify.isPlayingSong(tab_title)){
        var extracted = spotify.getSongDetails(tab_title);
        console.log(tab_title);
        helpers.notify(extracted);
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

  found.songza = songza.iterateTabs(); // Notifies playing songs inline; returns true if at least one tab was playing
  found.spotify = spotify.iterateTabs();
  // No Grooveshark support yet for the context menu check feature

  // No song is playing right now
  if (!(found.spotify || found.songza)) {
    helpers.notify(["No Songs Currently Playing", "Play some tunes and see their details here."]);
  }
}

function initialize() {
  configureNotifiers();
  Prefs.on("", onPrefChange); // set up preferences listener
  if (Prefs.prefs.contextMenu) { createContextMenu(); } // create menu based on pref
}

// Preferences listener
function onPrefChange(prefName) {
  switch (prefName) {
    case "contextMenu":
      if (Prefs.prefs.contextMenu) { createContextMenu(); } else { destroyContextMenu(); }
      break;   
  }
}

initialize(); // runs on Firefox start up and on installation

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
    contentScriptFile: [data.url("mutation_observer_scripts/grooveshark-body-id.js")], // body, #id
    attachTo: ["existing", "top"],
    onMessage: function(metadata){
      var extracted = grooveshark.getSongDetails(metadata);
      helpers.notify(extracted);
    }
  });
  // Songza
  pageMod.PageMod({
    include: "*.songza.com",
    contentScriptFile: [data.url("mutation_observer_scripts/songza-tab-title.js")], // subtree, head > title
    attachTo: ["existing", "top"],
    onMessage: function(tab_title){
      if (songza.isPlayingSong(tab_title)){
        var extracted = songza.getSongDetails(tab_title);
        helpers.notify(extracted);
      }
    }
  });
  // Spotify
  pageMod.PageMod({
    include: "*.play.spotify.com",
    contentScriptFile: [data.url("mutation_observer_scripts/spotify-tab-title.js")], // subtree, head > title
    attachTo: ["existing", "top"],
    onMessage: function(tab_title){
      if (spotify.isPlayingSong(tab_title)){
        var extracted = spotify.getSongDetails(tab_title);
        helpers.notify(extracted);
      }
    }
  });
}

function destroyContextMenu() {
  menuItem.destroy();
}

function displayCurrentSong() {
  var song_info = undefined;

  for each (var tab in tabs) {
    if (/^https?:\/\/grooveshark.com/.test(tab.url)) {
      grooveshark.doTabWork(tab); // inline notify and append id
    }
    else if (/^https?:\/\/play.spotify.com/.test(tab.url)) {
      song_info = spotify.doTabWork(tab.title);
      song_info.push(tab.id); // id for switching to the tab onClicking the notification
    }
    else if (/^https?:\/\/songza.com/.test(tab.url)) {
      song_info = songza.doTabWork(tab.title);
      song_info.push(tab.id); // id for switching to the tab onClicking the notification
    }

    if (typeof song_info !== "undefined") {
      helpers.notify(song_info); 
    }
  }

  // No song is playing right now
  // if (!found) {
    // console.log("nothing playing");
    // Do nothing
    // helpers.notify(["No Songs Currently Playing", "Play some songs and see their details here"]);
  // }
}

function initialize() {
  configureNotifiers(); // inject scripts
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

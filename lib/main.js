var tabs = require("sdk/tabs"),
    Prefs = require("sdk/simple-prefs"),
    menuItem, // context menu
    
    // External files
    grooveshark = require("./grooveshark"),
    songza = require("./songza"),
    spotify = require("./spotify"),
    rdio = require("./rdio"),
    soundcloud = require('./soundcloud'),
    helpers = require("./helpers"),
    ui = require("sdk/ui");

function createContextMenu() {
  var contextMenu = require("sdk/context-menu");
  menuItem = contextMenu.Item({
    label: "What's Playing Now",
    context: contextMenu.PageContext(),
    contentScript: 'self.on("click", function(){' + 'self.postMessage();' + '});',
    onMessage: function() { displayCurrentSong(); }
  });
}

// Auto song change notifications
function configureNotifiers() {
  var data = require("sdk/self").data;
  var pageMod = require("sdk/page-mod");
  // Grooveshark
  pageMod.PageMod({
    include: "*.grooveshark.com",
    contentScriptFile: [data.url("mutation_observer_scripts/grooveshark-body-id.js")], // body, #id
    attachTo: ["existing", "top", "frame"],
    onMessage: function(metadata){
      var extracted = grooveshark.getSongDetails(metadata);
      extracted.push('grooveshark');
      helpers.notify(extracted);
    }
  });
  // Songza
  pageMod.PageMod({
    include: "*.songza.com",
    contentScriptFile: [data.url("mutation_observer_scripts/songza-tab-title.js")], // subtree, head > title
    attachTo: ["existing", "top", "frame"],
    onMessage: function(tab_title){
      if (songza.isPlayingSong(tab_title)){
        var extracted = songza.getSongDetails(tab_title);
        extracted.push('songza');
        helpers.notify(extracted);
      }
    }
  });
  // Spotify
  pageMod.PageMod({
    include: "*.play.spotify.com",
    contentScriptFile: [data.url("mutation_observer_scripts/spotify-tab-title.js")], // subtree, head > title
    attachTo: ["existing", "top", "frame"],
    onMessage: function(tab_title){
      if (spotify.isPlayingSong(tab_title)){
        var extracted = spotify.getSongDetails(tab_title);
        extracted.push('spotify');
        helpers.notify(extracted);
      }
    }
  });
  // Rdio
  pageMod.PageMod({
    include: "*.rdio.com",
    contentScriptFile: [data.url("mutation_observer_scripts/rdio-body-class.js")], // body, .class
    attachTo: ["existing", "top", "frame"],
    onMessage: function(metadata){
      var extracted = rdio.getSongDetails(metadata);
      extracted.push('rdio');
      helpers.notify(extracted);
    }
  });
  // Soundcloud
  pageMod.PageMod({
    include: "*.soundcloud.com",
    contentScriptFile: [data.url("mutation_observer_scripts/soundcloud-body-class.js")], // body, .class
    attachTo: ["existing", "top", "frame"],
    onMessage: function(metadata){
      var extracted = soundcloud.getSongDetails(metadata);
      extracted.push('soundcloud');
      helpers.notify(extracted);
    }
  });
}

function destroyContextMenu() {
  menuItem.destroy();
}

// Context menu option
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
    else if (/^(?:https?:\/\/)?(?:www.)?rdio.com/.test(tab.url)) {
      rdio.doTabWork(tab); // inline notify and append id
    } 
    else if (/^(?:https?:\/\/)?(?:www.)?soundcloud.com/.test(tab.url)) {
      console.log("P");
      soundcloud.doTabWork(tab);
    }

    if (typeof song_info !== "undefined") {
      helpers.notify(song_info);
    }
  }

  // No song is playing right now
  // Unused becasue of the delay in MutationObserver repsonses
  // if (!found) {
    // console.log("nothing playing");
    // Do nothing
    // helpers.notify(["No Songs Currently Playing", "Play some songs and see their details here"]);
  // }
}

// Adds button to the toolbar, when clicked shows the current song name
var action_button = ui.ActionButton({
  id: "what-s-playing-action-button",
  label: "What Song is Playing?",
  icon: "./images/icon64.png",
  onClick: function(state) {
    displayCurrentSong();
  }
});

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

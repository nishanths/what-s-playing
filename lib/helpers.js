var notifications = require("sdk/notifications");

function notify(message) {
  notifications.notify({
      title: message[0],
      text: message[1]
  });
}

exports.notify = notify;

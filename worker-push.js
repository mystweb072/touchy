self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};

  const customData = payload.data || {};
  const reactionType = customData.type || "default";
  const sender = customData.senderName || "Someone";
  const senderAvatar = customData.senderAvatar;

  let title = "Nowa reakcja!";
  let body = "Ktoś wysłał Ci coś miłego";
  let vibrate = [100, 50, 100];

  switch (reactionType) {
    case "i_love_you":
      title = `${sender} loves you ❤️`;
      body = "Just wanted to let you know how much I care about you.";
      vibrate = [200, 100, 200];
      break;
    case "i_miss_you":
      title = `${sender} misses you! 🥺`;
      body = "Counting down the minutes until we're together again.";
      vibrate = [400, 200, 400];
      break;
    case "thinking_about_you":
      title = `${sender} thinks about you 💭`;
      body = "You just crossed my mind and made me smile.";
      vibrate = [150, 150];
      break;
    case "you_re_hot":
      title = `${sender} 🔥`;
      body = `${sender} is thinking about how good you look today.`;
      vibrate = [100, 50, 100, 50, 100];
      break;
    case "kiss_me":
      title = `A kiss from ${sender} 💋`;
      body = `${sender} is sending a little sweetness your way.`;
      vibrate = [300, 100, 300];
      break;
    case "i_want_you":
      title = `${sender} wants you... ✨`;
      body = "I'm really looking forward to being close to you later.";
      vibrate = [800, 200, 800];
      break;
    default:
      title = "New Touch! ✨";
      body = "Someone is thinking of you!";
      vibrate = [100, 50, 100];
      break;
  }

  const options = {
    body: body || payload.body,
    icon: "/icons/192x192.png",
    image: senderAvatar,
    badge: "/icons/badge-72x72.png",
    vibrate: vibrate,
    tag: reactionType,
    renotify: true,
    data: {
      url: customData.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title || payload.title, options),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

console.log("Service Worker Loaded...");

function OnNotificationClicked(first)
{
	console.log("OnNotificationClicked");
	console.log(first);
}
function OnNotificationClosed(first)
{
	console.log("OnNotificationClosed");
	console.log(first);
}

self.onnotificationclose = OnNotificationClosed;
self.onnotificationclick = OnNotificationClicked;


self.addEventListener("push", e =>
{
	console.log("Received push...");

	const data = e.data.json();
	console.log("received data...", data);
	self.registration.showNotification(data.title, data);
	console.log("notification sent...");
});

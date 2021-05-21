const publicVapidKey =
	"BL-S_aZTtFexs3wY4Q-5HkOIDuul9ojJ8c_XsninNaV03-m71dsm_S2ndJnf6dkoCjTdrvlx7POOvQujWLB1S-s";

// Check for service worker
if ("serviceWorker" in navigator)
{
	send();
}

async function send()
{
	await navigator.serviceWorker.register("/worker.js", {scope: "/"});
	let register = await navigator.serviceWorker.ready;

	const subscription = await register.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
	});

	await fetch("/subscribe", {
		method: "POST",
		body: JSON.stringify(subscription),
		headers: {
			"content-type": "application/json"
		}
	});
}

function urlBase64ToUint8Array(base64String)
{
	const padding = "=".repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, "+")
		.replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i)
	{
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

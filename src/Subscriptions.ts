export interface Subscription
{
	endpoint: string;
	expirationTime: null | number;
	keys: Keys;
}

export interface Keys
{
	p256dh: string;
	auth: string;
}
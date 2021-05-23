
export interface NotificationOptions
{
	title: string;
	actions?: NotificationAction[];
	badge?: string;
	body?: string;
	data?: any;
	dir?: NotificationDirection;
	icon?: string;
	image?: string;
	lang?: string;
	renotify?: boolean;
	requireInteraction?: boolean;
	silent?: boolean;
	tag?: string;
	timestamp?: number;
	vibrate?: VibratePattern;
}

export type NotificationDirection = "auto" | "ltr" | "rtl";
export type VibratePattern = number | number[];

export interface NotificationAction
{
	action: string;
	icon?: string;
	title: string;
}

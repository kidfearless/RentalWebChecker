import * as express from "express";
import * as WebPush from "web-push";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as sleep from "sleep-promise";
import * as File from "jsonfile";
import { Config } from "./Config";
import { Router } from './router';
import { RentChecker } from "./RentChecker";
import { JSONSubscription } from './JSONSubscription';
import { Subscription } from './Subscriptions';
import { NotificationOptions } from "./NotificationOptions";
import { JSONRental } from "./JSONRental";

export const ROOT_DIRECTORY = path.join(__dirname, "..");
export const CURRENT_DIRECTORY = path.join(__dirname);

export class App
{
	Config: Config;
	Router: Router;
	static Instance: App;
	RentChecker: RentChecker;
	public static GetInstance()
	{
		return App.Instance;
	}

	constructor()
	{
		App.Instance = this;

		this.Config = File.readFileSync("config.json") as Config;

		WebPush.setVapidDetails(
			"mailto:test@test.com",
			this.Config.Vapid.PublicKey,
			this.Config.Vapid.PrivateKey
		);

		JSONRental.AddInsertHook(this.OnRentalFound.bind(this));

		JSONRental.Init();
		JSONSubscription.Init();

		this.Router = new Router();

	}

	async OnRentalFound(rental: JSONRental)
	{
		let iterator = JSONSubscription.GetSubscriptions();

		for(let subscription of iterator)
		{
			await this.SendNotification(subscription.ToSubscription(), 
			{
				title: `New rental available for $${rental.Rent}`,
				body: `${rental.Beds} beds, ${rental.Baths} baths, ${rental.Size} FT`
			});
		}
	}

	public async SendNotification(subscription: Subscription, payload: NotificationOptions)
	{
		await WebPush.sendNotification(subscription, JSON.stringify(payload));
	}

	public Start()
	{
		this.Router.Start();
		this.RentChecker = new RentChecker();
	}
}

let app = new App();
app.Start();



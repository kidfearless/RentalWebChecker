import * as express from "express";
import * as WebPush from "web-push";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as sleep from "sleep-promise";
import * as File from "jsonfile";
import { Config } from "./Config";
import { Router } from './router';
import { DatabaseManager } from './DatabaseManager';
import { RentChecker } from "./RentChecker";
import { DBRental } from './DBRentals';
import { DBSubscription } from './DBSubscription';
import { Subscription } from './Subscriptions';
import { NotificationOptions } from "./NotificationOptions";

export class App
{
	Config: Config;
	Router: Router;
	Database: DatabaseManager;
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

		DBRental.AddInsertHook(this.OnRentalFound.bind(this));

		this.Database = new DatabaseManager(this.Config.Database);

		this.Router = new Router();

	}

	async OnRentalFound(rental: DBRental)
	{
		let subscriptions = await DBSubscription.GetAllSubscriptions();
		subscriptions.forEach((subscription: DBSubscription) =>
		{
			this.SendNotification(subscription.ToSubscription(), 
			{
				title: `New rental available for $${rental.Rent}`,
				body: `${rental.Beds} beds, ${rental.Baths} baths, ${rental.Size} FT`
			});
		});
	}

	public SendNotification(subscription: Subscription, payload: NotificationOptions)
	{
		WebPush.sendNotification(subscription, JSON.stringify(payload));
	}

	public async Start()
	{
		await this.Database.Connect();
		this.Router.Start();
		this.RentChecker = new RentChecker();
	}
}

let app = new App();
app.Start();



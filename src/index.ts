import * as express from "express";
import * as WebPush from "web-push";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as sleep from "sleep-promise";
import * as File from "jsonfile";
import { Config } from "./Config";
import { Router } from './router';
import { DatabaseManager } from './DatabaseManager';


export class App
{
	Config: Config;
	Router: Router;
	Database: DatabaseManager;
	static Instance: App;
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

		this.Database = new DatabaseManager(this.Config.Database);

		this.Router = new Router();
	}

	public async Start()
	{
		await this.Database.Connect()
		this.Router.Start();
	}
}

let app = new App();
app.Start();



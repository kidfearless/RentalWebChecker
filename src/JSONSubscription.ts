import { DataTypes, Model, Sequelize } from "sequelize";
import { ROOT_DIRECTORY } from ".";
import { Subscription } from './Subscriptions';
import * as Path from 'path';
import * as FileSystem from 'fs';
const File = FileSystem.promises;



export class JSONSubscription
{
	private static JSON_PATH = Path.join(ROOT_DIRECTORY, "Subscriptions.json");
	private static Cache: Map<string, JSONSubscription> = new Map();
	//#region fields
	private _auth: string;
	private _p256DH: string;
	private _endPoint: string;
	//#endregion

	//#region properties

	public get Auth(): string
	{
		return this._auth;
	}
	public set Auth(value: string)
	{
		this._auth = value;
	}

	public get P256DH(): string
	{
		return this._p256DH;
	}
	public set P256DH(value: string)
	{
		this._p256DH = value;
	}

	public get EndPoint(): string
	{
		return this._endPoint;
	}
	public set EndPoint(value: string)
	{
		this._endPoint = value;
	}
	//#endregion

	static async ImportFromFile()
	{
		let buffer = await File.readFile(this.JSON_PATH, { encoding: "utf8", flag: "r" });
		if(buffer.length <= 1)
		{
			await this.ExportToFile();
			return;
		}
		let array = JSON.parse(buffer);
		
		for(let i = 0; i < array.length; i++)
		{
			let subscription = array[i][1];
			Object.setPrototypeOf(subscription, JSONSubscription.prototype);
			array[i][1] = subscription;
		}

		this.Cache = new Map();
	}

	public static async ExportToFile()
	{
		await File.truncate(this.JSON_PATH);
		await File.writeFile(this.JSON_PATH, JSON.stringify(Array.from(this.Cache)), { encoding: "utf8" });
	}

	public static async Add(sub: Subscription): Promise<JSONSubscription>
	{
		let instance = new JSONSubscription();
		instance.EndPoint = sub.endpoint;
		instance.P256DH = sub.keys.p256dh;
		instance.Auth = sub.keys.auth;
		this.Cache.set(instance.EndPoint, instance);

		this.ExportToFile();
		return instance;
	}

	public static GetAllSubscriptions(): JSONSubscription[]
	{
		return Array.from(this.Cache.values()) as JSONSubscription[];
	}

	public static GetSubscriptions(): IterableIterator<JSONSubscription>
	{
		return this.Cache.values();
	}

	public ToSubscription(): Subscription
	{
		return {
			endpoint: this.EndPoint,
			keys: {
				p256dh: this.P256DH,
				auth: this.Auth
			}
		};
	}

	public static async Init()
	{
		if (FileSystem.existsSync(this.JSON_PATH))
		{
			this.ImportFromFile();
		}
		else
		{
			await File.appendFile(this.JSON_PATH, JSON.stringify(Array.from(this.Cache)), { encoding: "utf8" });
		}
	}
}

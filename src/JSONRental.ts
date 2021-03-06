import * as Path from 'path';
import { ROOT_DIRECTORY } from './index';
import * as File from 'fs/promises';
import * as FileSystem from 'fs';

interface ListingInsertedCallback
{
	(rental: JSONRental): void;
}

export class JSONRental
{
	private static JSON_PATH = Path.join(ROOT_DIRECTORY, "Rentals.json");
	private static Hooks: Set<ListingInsertedCallback> = new Set<ListingInsertedCallback>();
	private static Cache: Map<string, JSONRental> = new Map();

	//#region fields
	private _url: string;
	private _rent: number;
	private _size: number;
	private _beds: number;
	private _baths: number;
	private _description: string;
	//#endregion
	//#region properties
	public get Url()
	{
		return this._url;
	}
	public set Url(value)
	{
		this._url = value;
	}
	public get Rent()
	{
		return this._rent;
	}
	public set Rent(value)
	{
		this._rent = value;
	}
	public get Size()
	{
		return this._size;
	}
	public set Size(value)
	{
		this._size = value;
	}

	public get Beds()
	{
		return this._beds;
	}
	public set Beds(value)
	{
		this._beds = value;
	}
	public get Baths()
	{
		return this._baths;
	}
	public set Baths(value)
	{
		this._baths = value;
	}
	public get Description(): string
	{
		return this._description;
	}
	public set Description(value: string)
	{
		this._description = value;
	}
	//#endregion

	constructor(url?: string)
	{
		if (url)
		{
			this.Url = url;
		}
	}

	//#region Static methods
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
			Object.setPrototypeOf(subscription, JSONRental.prototype);
			array[i][1] = subscription;
		}
		this.Cache = new Map(array);
	}

	public static async ExportToFile()
	{
		await File.truncate(this.JSON_PATH);
		await File.writeFile(this.JSON_PATH, JSON.stringify(Array.from(this.Cache)), { encoding: "utf8" });
	}

	public static HasListing(url: string): boolean
	{
		return this.Cache.has(url);
	}

	public static AddInsertHook(func: ListingInsertedCallback)
	{
		JSONRental.Hooks.add(func);
	}

	public static RemoveInsertHook(func: ListingInsertedCallback)
	{
		JSONRental.Hooks.delete(func);
	}

	protected static InvokeInsertHooks(rental: JSONRental)
	{
		JSONRental.Hooks.forEach((func) =>
		{
			func(rental);
		});
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
	//#endregion
	//#region instance methods

	public CacheListing()
	{
		if(!JSONRental.Cache.has(this.Url))
		{
			JSONRental.InvokeInsertHooks(this);
		}
		JSONRental.Cache.set(this.Url, this);
	}

	//#endregion

	public static GetRentals(): IterableIterator<JSONRental>
	{
		return this.Cache.values();
	}
}

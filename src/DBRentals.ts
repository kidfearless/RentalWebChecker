import { DataTypes, Model, Sequelize } from "sequelize";
import { RentalListing } from './RentalListing';

interface ListingInsertedCallback
{
	(rental:DBRental):void;
}

export class DBRental extends Model
{
	public set URL(value) { throw ""; }
	public get URL(): string { throw ""; }

	public set Rent(value) { throw ""; }
	public get Rent(): number { throw ""; }

	public set Size(value) { throw ""; }
	public get Size(): number { throw ""; }

	public set Beds(value) { throw ""; }
	public get Beds(): number { throw ""; }

	public set Baths(value) { throw ""; }
	public get Baths(): number { throw ""; }

	private static Hooks:Set<ListingInsertedCallback> = new Set<ListingInsertedCallback>();

	public static async Find(url: string): Promise<DBRental>
	{
		let temp = await DBRental.findOne({
			where: {
				URL: url
			}
		});
		return temp;
	}
	/**
	 *
	 *
	 * @static
	 * @param {RentalListing} listing
	 * @return {Promise<[DBRental, boolean]>} [RentalListing from db, true if inserted into db false if already exists in db] 
	 * @memberof DBRental
	 */
	public static async FromRentalListing(listing: RentalListing): Promise<[DBRental, boolean]>
	{
		/* let result = await DBRental.findOne({
			where: {
				URL: listing.URL
			}
		});
		let returnValue = result;
		if(result == null)
		{
			returnValue = await DBRental.create({
				URL: listing.URL,
				Rent: listing.Rent,
				Size: listing.Size,
				Beds: listing.Beds,
				Baths: listing.Baths
			});
		}

		return [returnValue, result === null]; */

		let result = await DBRental.findOrCreate({where: {
			URL: listing.URL,
			Rent: listing.Rent,
			Size: listing.Size,
			Beds: listing.Beds,
			Baths: listing.Baths
		}});

		if(result[1])
		{
			DBRental.InvokeInsertHooks(result[0]);
		}
		return result;
	}

	public static AddInsertHook(func:ListingInsertedCallback)
	{
		DBRental.Hooks.add(func);
	}

	public static RemoveInsertHook(func: ListingInsertedCallback)
	{
		DBRental.Hooks.delete(func);
	}

	protected static InvokeInsertHooks(rental:DBRental)
	{
		DBRental.Hooks.forEach((func) =>
		{
			func(rental);
		})
	}

	public ToRentalListing()
	{
		let listing = new RentalListing();
		listing.URL = this.URL;
		listing.Rent = this.Rent;
		listing.Size = this.Size;
		listing.Beds = this.Beds;
		listing.Baths = this.Baths;
		return listing;
	}

	public static GetAllRentals(): Promise<DBRental[]>
	{
		return DBRental.findAll();
	}

	public static async Init(context: Sequelize)
	{
		// define creates the database the way we actually want, but init needs to be called in order to work properly.
		// So we do both.
		// TODO: Figure out proper usage
		DBRental.init({
			URL: {
				type: DataTypes.TEXT,
				allowNull: false,
				unique: true
			},
			Rent: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			Size: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			Beds: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			Baths: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		}, { sequelize: context, modelName: "Rentals" });

		context.define('Rentals', {
			URL: {
				type: DataTypes.TEXT,
				allowNull: false,
				unique: true
			},
			Rent: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			Size: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			Beds: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			Baths: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		});
	}
}

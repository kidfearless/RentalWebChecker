import { Dialect, Options, Sequelize } from "sequelize";
import { Config, DatabaseAuth } from './Config';
import { DBSubscription } from "./DBSubscription";
import { DBRental } from './DBRentals';

export class DatabaseManager
{
	Context: Sequelize;
	static Instance: DatabaseManager;

	public static GetInstance()
	{
		return DatabaseManager.Instance;
	}
	constructor(Config: DatabaseAuth)
	{
		DatabaseManager.Instance = this;
		this.Context = new Sequelize({
			dialect: Config.Dialect as Dialect,
			host: Config.Host,
			port: Config.Port,
			username: Config.User,
			password: Config.Password,
			database: Config.Database
		});

		DBSubscription.Init(this.Context);
		DBRental.Init(this.Context);

		// this.Context.sync({ force: true });
		this.Context.sync();
	}

	public async Connect()
	{
		try
		{
			await this.Context.authenticate();
			console.log('Connection has been established successfully.');
		}
		catch (error)
		{
			console.error('Unable to connect to the database:', error);
		}
	}
}
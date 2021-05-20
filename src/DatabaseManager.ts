import { DataTypes, Dialect, Model, Options, Sequelize } from "sequelize";
import { Config, DatabaseAuth } from './Config';
import { Subscription } from './Subscriptions';


export class DBSubscription extends Model
{
	[x: string]: any;
	public static FromSubscription(sub: Subscription): Promise<DBSubscription>
	{
		let temp = DBSubscription.create({ EndPoint: sub.endpoint, P256DH: sub.keys.p256dh, Auth: sub.keys.auth });
		return temp;
	}

	public ToSubscription(): Subscription
	{
		// @ts-ignore
		return {
			endpoint: this.EndPoint,
			keys: {
				p256dh: this.P256DH,
				auth: this.Auth
			}
		};
	}

	public static Init(context: Sequelize): void
	{
		context.define('Subscriptions', {
			// Model attributes are defined here
			EndPoint: {
				type: DataTypes.TEXT,
				allowNull: false,
				
			},
			P256DH: {
				type: DataTypes.STRING,
				allowNull: false
			},
			Auth: {
				type: DataTypes.STRING,
				allowNull: false
			},
		});

		DBSubscription.init({
			EndPoint: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			P256DH: {
				type: DataTypes.STRING,
				allowNull: false
			},
			Auth: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {sequelize: context});
	}
}

export class DatabaseManager
{
	Context: Sequelize;
	static Instance: DatabaseManager;

	public static GetIntance()
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

		this.Context.sync({force: true});
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
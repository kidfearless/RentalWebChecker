import { DataTypes, Dialect, Model, Options, Sequelize } from "sequelize";
import { Config, DatabaseAuth } from './Config';
import { Subscription } from './Subscriptions';


export class DBSubscription extends Model
{
	[x: string]: any;
	
	public get Auth() : string {throw ""}
	public set Auth(value : string) {}

	public get P256DH() : string {throw ""}
	public set P256DH(value : string) {}

	public get EndPoint() : string {throw ""}
	public set EndPoint(value : string) {}
	
	
	public static async FromSubscription(sub: Subscription): Promise<DBSubscription>
	{
		let temp = await DBSubscription.findCreateFind({
			where: {
				EndPoint: sub.endpoint, 
				P256DH: sub.keys.p256dh, 
				Auth: sub.keys.auth
			}
		});
		return temp[0];
	}

	public static async GetAllSubscriptions(): Promise<DBSubscription[]>
	{
		return DBSubscription.findAll();
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

	public static async Init(context: Sequelize)
	{
		// define creates the database the way we actually want, but init needs to be called in order to work properly.
		// So we do both.
		// TODO: Figure out proper usage
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
		}, { sequelize: context, modelName: "Subscriptions" });

		context.define('Subscriptions', {
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
		}, {
			indexes: [{
				unique: true,
				fields: ["EndPoint", "P256DH", "Auth"]
			}]
		});
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

		this.Context.sync({ force: true });
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
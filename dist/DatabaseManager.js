"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = exports.DBSubscription = void 0;
const sequelize_1 = require("sequelize");
class DBSubscription extends sequelize_1.Model {
    static FromSubscription(sub) {
        let temp = DBSubscription.create({ EndPoint: sub.endpoint, P256DH: sub.keys.p256dh, Auth: sub.keys.auth });
        return temp;
    }
    ToSubscription() {
        // @ts-ignore
        return {
            endpoint: this.EndPoint,
            keys: {
                p256dh: this.P256DH,
                auth: this.Auth
            }
        };
    }
    static Init(context) {
        context.define('Subscriptions', {
            // Model attributes are defined here
            EndPoint: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            P256DH: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            Auth: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
        });
        DBSubscription.init({
            EndPoint: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            P256DH: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            Auth: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            }
        }, { sequelize: context });
    }
}
exports.DBSubscription = DBSubscription;
class DatabaseManager {
    constructor(Config) {
        DatabaseManager.Instance = this;
        this.Context = new sequelize_1.Sequelize({
            dialect: Config.Dialect,
            host: Config.Host,
            port: Config.Port,
            username: Config.User,
            password: Config.Password,
            database: Config.Database
        });
        DBSubscription.Init(this.Context);
        this.Context.sync({ force: true });
    }
    static GetIntance() {
        return DatabaseManager.Instance;
    }
    Connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.Context.authenticate();
                console.log('Connection has been established successfully.');
            }
            catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        });
    }
}
exports.DatabaseManager = DatabaseManager;
//# sourceMappingURL=DatabaseManager.js.map
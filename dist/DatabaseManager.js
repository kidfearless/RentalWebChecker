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
exports.DatabaseManager = void 0;
const sequelize_1 = require("sequelize");
const DBSubscription_1 = require("./DBSubscription");
const DBRentals_1 = require("./DBRentals");
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
        DBSubscription_1.DBSubscription.Init(this.Context);
        DBRentals_1.DBRental.Init(this.Context);
        // this.Context.sync({ force: true });
        this.Context.sync();
    }
    static GetInstance() {
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
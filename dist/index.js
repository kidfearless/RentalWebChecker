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
exports.App = void 0;
const WebPush = require("web-push");
const File = require("jsonfile");
const router_1 = require("./router");
const DatabaseManager_1 = require("./DatabaseManager");
class App {
    constructor() {
        App.Instance = this;
        this.Config = File.readFileSync("config.json");
        WebPush.setVapidDetails("mailto:test@test.com", this.Config.Vapid.PublicKey, this.Config.Vapid.PrivateKey);
        this.Database = new DatabaseManager_1.DatabaseManager(this.Config.Database);
        this.Router = new router_1.Router();
    }
    static GetInstance() {
        return App.Instance;
    }
    Start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Database.Connect();
            this.Router.Start();
        });
    }
}
exports.App = App;
let app = new App();
app.Start();
//# sourceMappingURL=index.js.map
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
exports.App = exports.CURRENT_DIRECTORY = exports.ROOT_DIRECTORY = void 0;
const WebPush = require("web-push");
const path = require("path");
const File = require("jsonfile");
exports.ROOT_DIRECTORY = path.join(__dirname, "..");
exports.CURRENT_DIRECTORY = path.join(__dirname);
const router_1 = require("./router");
const RentChecker_1 = require("./RentChecker");
const JSONSubscription_1 = require("./JSONSubscription");
const JSONRental_1 = require("./JSONRental");
class App {
    constructor() {
        App.Instance = this;
        this.Config = File.readFileSync("config.json");
        WebPush.setVapidDetails("mailto:test@test.com", this.Config.Vapid.PublicKey, this.Config.Vapid.PrivateKey);
        JSONRental_1.JSONRental.AddInsertHook(this.OnRentalFound.bind(this));
        JSONRental_1.JSONRental.Init();
        JSONSubscription_1.JSONSubscription.Init();
        this.Router = new router_1.Router();
    }
    static GetInstance() {
        return App.Instance;
    }
    OnRentalFound(rental) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("found rental, sending notifications");
            let iterator = JSONSubscription_1.JSONSubscription.GetSubscriptions();
            for (let subscription of iterator) {
                yield this.SendNotification(subscription.ToSubscription(), {
                    title: `New rental available for $${rental.Rent}`,
                    body: `${rental.Beds} beds, ${rental.Baths} baths, ${rental.Size} FT`,
                    actions: [
                        {
                            action: "test-action",
                            title: "test title"
                        }
                    ]
                });
            }
        });
    }
    SendNotification(subscription, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield WebPush.sendNotification(subscription, JSON.stringify(payload));
        });
    }
    Start() {
        this.Router.Start();
        this.RentChecker = new RentChecker_1.RentChecker();
    }
}
exports.App = App;
let app = new App();
app.Start();
//# sourceMappingURL=index.js.map
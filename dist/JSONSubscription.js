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
exports.JSONSubscription = void 0;
const _1 = require(".");
const Path = require("path");
const File = require("fs/promises");
const FileSystem = require("fs");
class JSONSubscription {
    //#endregion
    //#region properties
    get Auth() {
        return this._auth;
    }
    set Auth(value) {
        this._auth = value;
    }
    get P256DH() {
        return this._p256DH;
    }
    set P256DH(value) {
        this._p256DH = value;
    }
    get EndPoint() {
        return this._endPoint;
    }
    set EndPoint(value) {
        this._endPoint = value;
    }
    //#endregion
    static ImportFromFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = yield File.readFile(this.JSON_PATH, { encoding: "utf8", flag: "r" });
            if (buffer.length <= 1) {
                yield this.ExportToFile();
                return;
            }
            let array = JSON.parse(buffer);
            for (let i = 0; i < array.length; i++) {
                let subscription = array[i][1];
                Object.setPrototypeOf(subscription, JSONSubscription.prototype);
                array[i][1] = subscription;
            }
            this.Cache = new Map();
        });
    }
    static ExportToFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield File.truncate(this.JSON_PATH);
            yield File.writeFile(this.JSON_PATH, JSON.stringify(Array.from(this.Cache)), { encoding: "utf8" });
        });
    }
    static Add(sub) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = new JSONSubscription();
            instance.EndPoint = sub.endpoint;
            instance.P256DH = sub.keys.p256dh;
            instance.Auth = sub.keys.auth;
            this.Cache.set(instance.EndPoint, instance);
            yield this.ExportToFile();
            return instance;
        });
    }
    static GetAllSubscriptions() {
        return Array.from(this.Cache.values());
    }
    static GetSubscriptions() {
        return this.Cache.values();
    }
    ToSubscription() {
        return {
            endpoint: this.EndPoint,
            keys: {
                p256dh: this.P256DH,
                auth: this.Auth
            }
        };
    }
    static Init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (FileSystem.existsSync(this.JSON_PATH)) {
                this.ImportFromFile();
            }
            else {
                yield File.appendFile(this.JSON_PATH, JSON.stringify(Array.from(this.Cache)), { encoding: "utf8" });
            }
        });
    }
}
exports.JSONSubscription = JSONSubscription;
JSONSubscription.JSON_PATH = Path.join(_1.ROOT_DIRECTORY, "Subscriptions.json");
JSONSubscription.Cache = new Map();
//# sourceMappingURL=JSONSubscription.js.map
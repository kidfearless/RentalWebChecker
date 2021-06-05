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
exports.JSONRental = void 0;
const Path = require("path");
const index_1 = require("./index");
const File = require("fs/promises");
const FileSystem = require("fs");
class JSONRental {
    //#endregion
    constructor(url) {
        if (url) {
            this.Url = url;
        }
    }
    //#endregion
    //#region properties
    get Url() {
        return this._url;
    }
    set Url(value) {
        this._url = value;
    }
    get Rent() {
        return this._rent;
    }
    set Rent(value) {
        this._rent = value;
    }
    get Size() {
        return this._size;
    }
    set Size(value) {
        this._size = value;
    }
    get Beds() {
        return this._beds;
    }
    set Beds(value) {
        this._beds = value;
    }
    get Baths() {
        return this._baths;
    }
    set Baths(value) {
        this._baths = value;
    }
    get Description() {
        return this._description;
    }
    set Description(value) {
        this._description = value;
    }
    //#region Static methods
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
                Object.setPrototypeOf(subscription, JSONRental.prototype);
                array[i][1] = subscription;
            }
            this.Cache = new Map(array);
        });
    }
    static ExportToFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield File.truncate(this.JSON_PATH);
            yield File.writeFile(this.JSON_PATH, JSON.stringify(Array.from(this.Cache)), { encoding: "utf8" });
        });
    }
    static HasListing(url) {
        return this.Cache.has(url);
    }
    static AddInsertHook(func) {
        JSONRental.Hooks.add(func);
    }
    static RemoveInsertHook(func) {
        JSONRental.Hooks.delete(func);
    }
    static InvokeInsertHooks(rental) {
        JSONRental.Hooks.forEach((func) => {
            func(rental);
        });
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
    //#endregion
    //#region instance methods
    CacheListing() {
        if (!JSONRental.Cache.has(this.Url)) {
            JSONRental.InvokeInsertHooks(this);
        }
        JSONRental.Cache.set(this.Url, this);
    }
    //#endregion
    static GetRentals() {
        return this.Cache.values();
    }
}
exports.JSONRental = JSONRental;
JSONRental.JSON_PATH = Path.join(index_1.ROOT_DIRECTORY, "Rentals.json");
JSONRental.Hooks = new Set();
JSONRental.Cache = new Map();
//# sourceMappingURL=JSONRental.js.map
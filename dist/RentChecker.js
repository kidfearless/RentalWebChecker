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
exports.RentChecker = void 0;
const _1 = require(".");
const node_fetch_1 = require("node-fetch");
const DomParser = require("dom-parser");
class RentChecker {
    constructor() {
        this.Timer = setInterval(this.OnTicked.bind(this), 1000 * 60 * 15);
        this.OnTicked();
        this.Parser = new DomParser();
    }
    OnTicked() {
        return __awaiter(this, void 0, void 0, function* () {
            let app = _1.App.GetInstance();
            let response = yield node_fetch_1.default("https://eaglecap.appfolio.com/listings?1621624388116");
            let body = yield response.text();
            let html = this.Parser.parseFromString(body);
        });
    }
}
exports.RentChecker = RentChecker;
//# sourceMappingURL=RentChecker.js.map
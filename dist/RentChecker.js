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
const node_fetch_1 = require("node-fetch");
const DomParser = require("dom-parser");
const RentalListing_1 = require("./RentalListing");
const DBRentals_1 = require("./DBRentals");
class RentChecker {
    constructor() {
        this.Timer = setInterval(this.OnTicked.bind(this), 1000 * 60 * 15);
        this.OnTicked();
        this.Parser = new DomParser();
    }
    OnTicked() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.CheckEagleCap();
        });
    }
    CheckEagleCap() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield node_fetch_1.default("https://eaglecap.appfolio.com/listings?1621624388116");
            let body = yield response.text();
            let html = this.Parser.parseFromString(body);
            let listings = html.getElementsByClassName("listing-item");
            listings.forEach((value) => __awaiter(this, void 0, void 0, function* () {
                let listing = new RentalListing_1.RentalListing();
                console.log(value);
                let image = value.getElementsByClassName("listing-item__figure-container")[0];
                let url = image.childNodes[1].getAttribute("href");
                listing.URL = response.url + url;
                let facts = value.getElementsByClassName("js-listing-quick-facts")[0];
                let allFacts = facts.getElementsByClassName("detail-box__item");
                allFacts.forEach((elements) => {
                    let key = elements.childNodes[1].textContent;
                    let value = elements.childNodes[3].textContent;
                    switch (key) {
                        case "RENT":
                            listing.Rent = parseInt(value.substring(1));
                            break;
                        case "Square Feet":
                            listing.Size = parseInt(value);
                            break;
                        case "Bed / Bath":
                            let split = value.split("/");
                            listing.Beds = (split[0] === "Studio ") ? 0 : parseInt(split[0]);
                            listing.Baths = parseInt(split[1]);
                            break;
                        default: break;
                    }
                });
                listing.Description = value.getElementsByClassName("js-listing-description")[0].textContent;
                let result = yield DBRentals_1.DBRental.FromRentalListing(listing);
            }));
        });
    }
}
exports.RentChecker = RentChecker;
//# sourceMappingURL=RentChecker.js.map
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
exports.DBRental = void 0;
const sequelize_1 = require("sequelize");
const RentalListing_1 = require("./RentalListing");
class DBRental extends sequelize_1.Model {
    set URL(value) { throw ""; }
    get URL() { throw ""; }
    set Rent(value) { throw ""; }
    get Rent() { throw ""; }
    set Size(value) { throw ""; }
    get Size() { throw ""; }
    set Beds(value) { throw ""; }
    get Beds() { throw ""; }
    set Baths(value) { throw ""; }
    get Baths() { throw ""; }
    static Find(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let temp = yield DBRental.findOne({
                where: {
                    URL: url
                }
            });
            return temp;
        });
    }
    /**
     *
     *
     * @static
     * @param {RentalListing} listing
     * @return {Promise<[DBRental, boolean]>} [RentalListing from db, true if inserted into db false if already exists in db]
     * @memberof DBRental
     */
    static FromRentalListing(listing) {
        return __awaiter(this, void 0, void 0, function* () {
            /* let result = await DBRental.findOne({
                where: {
                    URL: listing.URL
                }
            });
            let returnValue = result;
            if(result == null)
            {
                returnValue = await DBRental.create({
                    URL: listing.URL,
                    Rent: listing.Rent,
                    Size: listing.Size,
                    Beds: listing.Beds,
                    Baths: listing.Baths
                });
            }
    
            return [returnValue, result === null]; */
            let result = yield DBRental.findOrCreate({ where: {
                    URL: listing.URL,
                    Rent: listing.Rent,
                    Size: listing.Size,
                    Beds: listing.Beds,
                    Baths: listing.Baths
                } });
            if (result[1]) {
                DBRental.InvokeInsertHooks(result[0]);
            }
            return result;
        });
    }
    static AddInsertHook(func) {
        DBRental.Hooks.add(func);
    }
    static RemoveInsertHook(func) {
        DBRental.Hooks.delete(func);
    }
    static InvokeInsertHooks(rental) {
        DBRental.Hooks.forEach((func) => {
            func(rental);
        });
    }
    ToRentalListing() {
        let listing = new RentalListing_1.RentalListing();
        listing.URL = this.URL;
        listing.Rent = this.Rent;
        listing.Size = this.Size;
        listing.Beds = this.Beds;
        listing.Baths = this.Baths;
        return listing;
    }
    static GetAllRentals() {
        return DBRental.findAll();
    }
    static Init(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // define creates the database the way we actually want, but init needs to be called in order to work properly.
            // So we do both.
            // TODO: Figure out proper usage
            DBRental.init({
                URL: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false,
                    unique: true
                },
                Rent: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                },
                Size: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                },
                Beds: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                },
                Baths: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                }
            }, { sequelize: context, modelName: "Rentals" });
            context.define('Rentals', {
                URL: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false,
                    unique: true
                },
                Rent: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                },
                Size: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                },
                Beds: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                },
                Baths: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                }
            });
        });
    }
}
exports.DBRental = DBRental;
DBRental.Hooks = new Set();
//# sourceMappingURL=DBRentals.js.map
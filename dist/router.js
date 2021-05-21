"use strict";
/// <reference types="express-serve-static-core" />
/// <reference types="serve-static" />
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
exports.Router = void 0;
const express = require("express");
const path = require("path");
const sleep = require("sleep-promise");
const WebPush = require("web-push");
const DatabaseManager_1 = require("./DatabaseManager");
class Router {
    constructor() {
        this.GetRoutes = {};
        this.PostRoutes = {};
        this.Express = express();
        this.Express.use(express.static(path.join(__dirname, "..", "client")));
        this.Express.use(express.json());
        this.PostRoutes["subscribe"] = this.Subscribe;
    }
    Subscribe(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = DatabaseManager_1.DatabaseManager.GetIntance();
            // Get pushSubscription object
            const subscription = request.body;
            let dbSub = DatabaseManager_1.DBSubscription.FromSubscription(subscription);
            let sub = yield dbSub;
            console.log(JSON.stringify(subscription));
            // Send 201 - resource created
            response.status(201).json({});
            // Create payload
            const payload = JSON.stringify({ title: "Push Test" });
            yield sleep(2000);
            // Pass object into sendNotification
            WebPush
                .sendNotification(subscription, payload)
                .catch(err => console.error(err));
        });
    }
    Start(port = 5006) {
        for (const key in this.GetRoutes) {
            const value = this.GetRoutes[key];
            console.log(`added get route: ${key}`);
            this.Express.get(`/${key}`, (req, res) => {
                console.log(`Firing ${key} route`);
                value(req, res);
            });
        }
        for (const key in this.PostRoutes) {
            const value = this.PostRoutes[key];
            console.log(`added post route: ${key}`);
            this.Express.post(`/${key}`, (req, res) => {
                console.log(`Firing ${key} route`);
                value(req, res);
            });
        }
        this.Express.listen(port, () => console.log(`Server started on port ${port}`));
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map
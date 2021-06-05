/// <reference types="express-serve-static-core" />
/// <reference types="serve-static" />

import * as core from 'express-serve-static-core';

import * as express from "express";
import path = require("path");
import { IEndPointFunction } from './IEndPointFunction';
import sleep = require('sleep-promise');
import * as WebPush from "web-push";
import { JSONSubscription } from "./JSONSubscription";
import { JSONRental } from './JSONRental';
import { App } from '.';
import { Subscription } from './Subscriptions';


interface EndPointDictionary
{
	[endpoint:string]: IEndPointFunction;
}



export class Router
{
	private Express: core.Express;
	Request: express.Request;
	Response: express.Response;
	GetRoutes: EndPointDictionary;
	PostRoutes: EndPointDictionary;

	constructor()
	{
		this.GetRoutes = {};
		this.PostRoutes = {};
		
		this.Express = express();
		
		this.Express.use(express.static(path.join(__dirname, "..", "client")));
		this.Express.use(express.json());

		this.PostRoutes["subscribe"] = this.Subscribe;
	}

	public async Subscribe(request: express.Request, response: express.Response)
	{
		// Get pushSubscription object
		const subscription:Subscription = request.body;


		await JSONSubscription.Add(subscription);

		// Send 201 - resource created
		response.status(201).send();
		
		// Send the current cached notifications for testing.
		for (const rental of JSONRental.GetRentals())
		{
			await App.SendNotification(subscription, rental);
		}
	}


	public Start(port:number = 5006):void
	{
		for (const key in this.GetRoutes)
		{
			const value = this.GetRoutes[key];
			console.log(`added get route: ${key}`);
			this.Express.get(`/${key}`, (req, res) =>
			{
				console.log(`Firing ${key} route`);
				value(req, res);
			});
		}
		
		for (const key in this.PostRoutes)
		{
			const value = this.PostRoutes[key];
			console.log(`added post route: ${key}`);
			this.Express.post(`/${key}`, (req, res) =>
			{
				console.log(`Firing ${key} route`);
				value(req, res);
			});
		}
		this.Express.listen(port, () => console.log(`Server started on port ${port}`));	
	}
}
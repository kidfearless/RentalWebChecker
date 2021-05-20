/// <reference types="express-serve-static-core" />
/// <reference types="serve-static" />

import * as core from 'express-serve-static-core';

import * as express from "express";
import path = require("path");
import { IEndPointFunction } from './IEndPointFunction';
import sleep = require('sleep-promise');
import * as WebPush from "web-push";
import typehole from "typehole";
import { DatabaseManager, DBSubscription } from './DatabaseManager';


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
		let db = DatabaseManager.GetIntance();
		// Get pushSubscription object
		const subscription = request.body;

		let dbSub = DBSubscription.FromSubscription(subscription);
		await dbSub;

		console.log(JSON.stringify(subscription));

		// Send 201 - resource created
		response.status(201).json({});

		// Create payload
		const payload = JSON.stringify({ title: "Push Test" });

		await sleep(2_000);

		// Pass object into sendNotification
		WebPush
			.sendNotification(subscription, payload)
			.catch(err => console.error(err));
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
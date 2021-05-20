import * as express from "express";


export interface IEndPointFunction
{
	(request: express.Request, response: express.Response): void | Promise<void>;
}

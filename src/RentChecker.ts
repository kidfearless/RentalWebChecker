import { App } from ".";
import {default as fetch} from "node-fetch";
import DomParser = require("dom-parser");
export class RentChecker
{
	Timer: NodeJS.Timeout;
	Parser: DomParser;
	constructor()
	{
		this.Timer = setInterval(this.OnTicked.bind(this), 1_000 * 60 * 15);
		this.OnTicked();
		this.Parser = new DomParser();
	}
	

	public async OnTicked()
	{
		let app = App.GetInstance();
		let response = await fetch("https://eaglecap.appfolio.com/listings?1621624388116");
		let body = await response.text();
		let html = this.Parser.parseFromString(body);
	}
}

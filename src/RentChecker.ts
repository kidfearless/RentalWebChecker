import { App } from ".";
import { default as fetch } from "node-fetch";
import DomParser = require("dom-parser");
import { JSONRental } from './JSONRental';

const EAGLE_CAP_URL = "https://eaglecap.appfolio.com/listings?1621624388116";

export class RentChecker
{
	Timer: NodeJS.Timeout;
	Parser: DomParser;
	constructor()
	{
		this.Timer = setInterval(this.OnTicked.bind(this), 1000 * 30 * 1);
		this.OnTicked();
		this.Parser = new DomParser();
	}

	public async OnTicked()
	{
		console.log("checking new rentals");
		await this.CheckEagleCap();
	}

	private async CheckEagleCap()
	{
		let response = await fetch(EAGLE_CAP_URL);
		let body = await response.text();
		let html = this.Parser.parseFromString(body);
		let listings = html.getElementsByClassName("listing-item");
		for(let i = 0; i < listings.length; i++)
		{
			await this.ParseListing(listings[i]);
		}

		await JSONRental.ExportToFile();
	}

	private async ParseListing(value: DomParser.Node)
	{
		let image = value.getElementsByClassName("listing-item__figure-container")[0];
		let url = EAGLE_CAP_URL + image.childNodes[1].getAttribute("href");

		if (JSONRental.HasListing(url))
		{
			return;
		}

		let listing = new JSONRental(url);

		let facts = value.getElementsByClassName("js-listing-quick-facts")[0];
		let allFacts = facts.getElementsByClassName("detail-box__item");
		allFacts.forEach((elements) =>
		{
			let key = elements.childNodes[1].textContent;
			let value = elements.childNodes[3].textContent;

			switch (key)
			{
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

		listing.CacheListing();
	}
}

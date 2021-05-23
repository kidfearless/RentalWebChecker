import { App } from ".";
import { default as fetch } from "node-fetch";
import DomParser = require("dom-parser");
import { RentalListing } from "./RentalListing";
import { DBRental } from './DBRentals';


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
		await this.CheckEagleCap();
	}

	private async CheckEagleCap()
	{
		let response = await fetch("https://eaglecap.appfolio.com/listings?1621624388116");
		let body = await response.text();
		let html = this.Parser.parseFromString(body);
		let listings = html.getElementsByClassName("listing-item");
		listings.forEach(async (value) =>
		{
			let listing = new RentalListing();
			console.log(value);

			let image = value.getElementsByClassName("listing-item__figure-container")[0];
			let url = image.childNodes[1].getAttribute("href");
			listing.URL = response.url + url;

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

			let result = await DBRental.FromRentalListing(listing);
		});
	}
}

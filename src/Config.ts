import { VapidDetails } from "./VapidDetails";


export interface DatabaseAuth
{
	Database: string;
	User: string,
	Password: string,
	Port: number,
	Host: string,
	Dialect: string
}

export interface Config
{
	Vapid: VapidDetails;
	Database: DatabaseAuth;
}

import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

export interface GenreModel extends Base {}

export class GenreModel extends TimeStamps {
	@prop()
	name: string;

	@prop({ unique: true })
	slug: string;

	@prop()
	description: string;

	@prop({ default: [] })
	icon: string;
}

// TimeStamps это дефолтный класс содержащий поля "createdAt", "updatedAt"
// Base это дефолтный класс содержащий поля "_id" и "__v"

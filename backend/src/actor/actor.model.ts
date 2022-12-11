import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export interface ActorModel extends Base {}

export class ActorModel extends TimeStamps {
	@prop()
	name: string;

	@prop({ unique: true })
	slug: string;

	@prop()
	photo: string;
}

// TimeStamps это дефолтный класс содержащий поля "createdAt", "updatedAt"
// Base это дефолтный класс содержащий поля "_id" и "__v"

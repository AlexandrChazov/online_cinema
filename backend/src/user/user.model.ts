import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string;

	@prop()
	password: string;

	@prop({ default: false })
	isAdmin: boolean;

	@prop({ default: [] })
	favorites?: [];
}

// TimeStamps это дефолтный класс содержащий поля "createdAt", "updatedAt"
// Base это дефолтный класс содержащий поля "_id" и "__v"

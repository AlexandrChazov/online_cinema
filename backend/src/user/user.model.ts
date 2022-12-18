import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop, Ref } from "@typegoose/typegoose";
import { MovieModel } from "../movie/movie.model";

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string;

	@prop()
	password: string;

	@prop({ default: false })
	isAdmin: boolean;

	@prop({ default: [], ref: () => MovieModel })
	favorites?: Ref<MovieModel>[]; // будет храниться массив id фильмов
}

// TimeStamps это дефолтный класс содержащий поля "createdAt", "updatedAt"
// Base это дефолтный класс содержащий поля "_id" и "__v"

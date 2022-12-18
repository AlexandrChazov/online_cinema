import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop, Ref } from "@typegoose/typegoose";
import { MovieModel } from "../movie/movie.model";
import { UserModel } from "../user/user.model";

export interface RatingModel extends Base {}

export class RatingModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	user: Ref<UserModel>;

	@prop({ ref: () => MovieModel })
	movie: Ref<MovieModel>;

	@prop()
	value: number;
}

// TimeStamps это дефолтный класс содержащий поля "createdAt", "updatedAt"
// Base это дефолтный класс содержащий поля "_id" и "__v"

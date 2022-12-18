import { IsNotEmpty, MinLength } from "class-validator";
import { Types } from "mongoose";

export class GenresIdsDto {
	@IsNotEmpty()
	@MinLength(24, { each: true })
	genreIds: Types.ObjectId[];
}

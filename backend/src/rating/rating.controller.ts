import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from "@nestjs/common";
import { RatingService } from "./rating.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { User } from "../user/decorators/user.decorator";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { Types } from "mongoose";
import { SetRatingDto } from "./dto/set-rating.dto";

@Controller("ratings")
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@UsePipes(new ValidationPipe())
	@Post("set-rating")
	@HttpCode(200)
	@Auth()
	async setRating(@User("_id") _id: Types.ObjectId, @Body() dto: SetRatingDto) {
		return this.ratingService.setRating(_id, dto);
	}

	@Get("/:movieId")
	@Auth()
	async getMovieValueByUser(
		@Param("movieId", IdValidationPipe) movieId: Types.ObjectId,
		@User("_id") userId: Types.ObjectId
	) {
		return this.ratingService.getMovieValueByUser(movieId, userId);
	}
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { RatingModel } from "./rating.model";
import { MovieService } from "../movie/movie.service";
import { Types } from "mongoose";
import { SetRatingDto } from "./dto/set-rating.dto";

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly RatingModel: ModelType<RatingModel>,
		private readonly movieService: MovieService
	) {}

	async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
		return await this.RatingModel.findOne({ movie: movieId, user: userId })
			.select("value")
			.exec()
			.then(data => (data ? data.value : 0));
	}

	async avarageRatingByMovie(movieId: Types.ObjectId | string) {
		const ratingsMovie: RatingModel[] = await this.RatingModel.aggregate()
			.match({
				movie: new Types.ObjectId(movieId)
			})
			.exec();
		return (
			ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
			ratingsMovie.length
		);
	}

	async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
		const { movieId, value } = dto;
		const newRating = await this.RatingModel.findOneAndUpdate(
			{
				user: userId,
				movie: movieId
			},
			{
				user: userId,
				movie: movieId,
				value
			},
			{
				new: true, // вернётся новое, то что мы только что создали
				upsert: true, // если не найдёт, то создаст новый
				setDefaultsOnInsert: true
			}
		).exec();

		const avarageRating = await this.avarageRatingByMovie(movieId);

		await this.movieService.updateRating(movieId, avarageRating);

		return newRating;
	}
}

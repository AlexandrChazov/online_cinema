import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { MovieModel } from "./movie.model";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Types } from "mongoose";
import { TelegramService } from "../telegram/telegram.service";

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
		private readonly telegramService: TelegramService
	) {}

	async getAll(searchTerm?: string) {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, "ig")
					}
				]
			};
		}

		return await this.MovieModel.find(options)
			.select("-updatedAt -v") // отбрасываем св-ва, которые нам не нужны
			.sort({ createdAt: "desc" }) // сверху списка будут те юзеры, которые зарегались раньше остальных
			.populate("actors genres") // вместо обычных id подтянутся все поля actors и genres
			.exec();
	}

	async getBySlug(slug: string) {
		const doc = await this.MovieModel.findOne({ slug })
			.populate("actors genres") // вместо обычных id подтянутся все поля actors и genres
			.exec();
		if (!doc) throw new NotFoundException("Movie not found");
		return doc;
	}

	async getByActor(actorId: Types.ObjectId) {
		const docs = await this.MovieModel.find({ actors: actorId }).exec();
		if (!docs) throw new NotFoundException("Movies not found");
		return docs;
	}

	async getByGenres(genreIds: Types.ObjectId[]) {
		const docs = await this.MovieModel.find({
			genres: { $in: genreIds } // $in - ищем массив в массиве
		}).exec();
		if (!docs) throw new NotFoundException("Movies not found");
		return docs;
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{ $inc: { countOpened: 1 } }, // $inc - инкремент на один
			{ new: true } // возвращать уже обновлённые данные
		).exec();
		if (!updateDoc) throw new NotFoundException("Movie not found");
		return updateDoc;
	}

	async getMostPopular() {
		return await this.MovieModel.find({
			countOpened: { $gt: 0 } // $gt - оператор больше чем
		})
			.sort({ countOpened: -1 })
			.populate("genres") // вместо обычных id подтянутся все поля actors и genres
			.exec();
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return await this.MovieModel.findByIdAndUpdate(
			id,
			{
				rating: newRating
			},
			{
				new: true
			}
		).exec();
	}

	/*  Всё что ниже идёт для админа  */

	async getById(_id: string) {
		const doc = await this.MovieModel.findById(_id).exec();
		if (!doc) throw new NotFoundException("Movie not found");
		return doc;
	}

	// создадим пустой документ, а потом пользователь будет его редактировать на фронте
	// чтобы на фронте не создавать отдельную страницу для создания нового документа
	// возвращаем пользователю id и отправляем его с этим id на страницу редактирования
	async create() {
		const defaultValue: UpdateMovieDto = {
			poster: "",
			bigPoster: "",
			actors: [],
			genres: [],
			title: "",
			videoUrl: "",
			slug: ""
		};
		const movie = await this.MovieModel.create(defaultValue);
		return movie._id;
	}

	async update(_id: string, dto: UpdateMovieDto) {
		/* Telegram notification */
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto);
			dto.isSendTelegram = true;
		}

		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true // создастся новая запись
		}).exec();
		if (!updateDoc) throw new NotFoundException("Movie not found");
		return updateDoc;
	}

	async delete(id: string) {
		const deletedDoc = await this.MovieModel.findByIdAndDelete(id).exec();
		if (!deletedDoc) {
			throw new NotFoundException("Movie not found");
		}
		return deletedDoc;
	}

	async sendNotification(dto: UpdateMovieDto) {
		if (process.env.NODE_ENV !== "development") {
			await this.telegramService.sendPhoto(dto.poster);
		}
		const message = `<b>${dto.title}</b>`;

		await this.telegramService.sendMessage(message, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							url: "https://okko.tv/movie/free-guy",
							text: "🍿 Go to watch"
						}
					]
				]
			}
		});
	}
}

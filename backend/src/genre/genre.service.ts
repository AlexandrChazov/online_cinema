import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { genSalt, hash } from "bcryptjs";
import { GenreModel } from "./genre.model";
import { CreateGenreDto } from "./dto/create-genre.dto";

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	async getGenreBySlug(slug: string) {
		const doc = await this.GenreModel.findOne({ slug }).exec();
		if (!doc) {
			throw new NotFoundException("Genre not found");
		}
		return doc;
	}

	async getAllGenres(searchTerm?: string) {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, "ig")
					},
					{
						slug: new RegExp(searchTerm, "ig")
					},
					{
						description: new RegExp(searchTerm, "ig")
					}
				]
			};
		}

		return await this.GenreModel.find(options)
			.select("-updatedAt -v") // отбрасываем св-ва, которые нам не нужны
			.sort({ createdAt: "desc" }) // сверху списка будут те юзеры, которые зарегались раньше остальных
			.exec();
		// запросы Mongoose не являются промисами, они возвращают "thenable", это не совсем промис хотя и похож
		// "exec()" пишется для возвращения реального промиса
		// иначе вторым параметром нужно передавать колбэк Genre.findOne({ name: 'daniel' }, function (err, user) {}
	}

	// todo
	async getCollections() {
		const genres = await this.getAllGenres();
		const collections = genres;
		return collections;
	}

	/*  Всё что ниже идёт для админа  */

	async getGenreById(_id: string) {
		const genre = await this.GenreModel.findById(_id).exec();
		if (!genre) throw new NotFoundException("Genre not found");
		return genre;
	}

	// создадим пустой документ, а потом пользователь будет его редактировать на фронте
	// чтобы на фронте не создавать отдельную страницу для создания нового документа
	// возвращаем пользователю id и отправляем его с этим id на страницу редактирования
	async create() {
		const defaultValue: CreateGenreDto = {
			name: "",
			slug: "",
			description: "",
			icon: ""
		};
		const genre = await this.GenreModel.create(defaultValue);
		return genre._id;
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true // создастся новая запись
		}).exec();
		if (!updateGenre) {
			throw new NotFoundException("Genre not found");
		}
		return updateGenre;
	}

	async delete(id: string) {
		const deletedGenre = await this.GenreModel.findByIdAndDelete(id).exec();
		// запросы Mongoose не являются промисами, они возвращают "thenable", это не совсем промис хотя и похож
		// "exec()" пишется для возвращения реального промиса
		// иначе вторым параметром нужно передавать колбэк Genre.findOne({ name: 'daniel' }, function (err, user) {}
		if (!deletedGenre) {
			throw new NotFoundException("Genre not found");
		}
		return deletedGenre;
	}
}

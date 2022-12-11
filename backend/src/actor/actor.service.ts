import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { ActorModel } from "./actor.model";
import { ActorDto } from "./actor.dto";

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async getActorBySlug(slug: string) {
		const doc = await this.ActorModel.findOne({ slug }).exec();
		if (!doc) {
			throw new NotFoundException("Actor not found");
		}
		return doc;
	}

	async getAllActors(searchTerm?: string) {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, "ig")
					},
					{
						slug: new RegExp(searchTerm, "ig")
					}
				]
			};
		}

		// todo Aggregation

		return await this.ActorModel.find(options)
			.select("-updatedAt -v") // отбрасываем св-ва, которые нам не нужны
			.sort({ createdAt: "desc" }) // сверху списка будут те юзеры, которые зарегались раньше остальных
			.exec();
	}

	/*  Всё что ниже идёт для админа  */

	async getActorById(_id: string) {
		const actor = await this.ActorModel.findById(_id).exec();
		if (!actor) throw new NotFoundException("Actor not found");
		return actor;
	}

	// создадим пустой документ, а потом пользователь будет его редактировать на фронте
	// чтобы на фронте не создавать отдельную страницу для создания нового документа
	// возвращаем пользователю id и отправляем его с этим id на страницу редактирования
	async create() {
		const defaultValue: ActorDto = {
			name: "",
			slug: "",
			photo: ""
		};
		const actor = await this.ActorModel.create(defaultValue);
		return actor._id;
	}

	async update(_id: string, dto: ActorDto) {
		const updateActor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true // создастся новая запись
		}).exec();
		if (!updateActor) {
			throw new NotFoundException("Actor not found");
		}
		return updateActor;
	}

	async delete(id: string) {
		const deletedActor = await this.ActorModel.findByIdAndDelete(id).exec();
		if (!deletedActor) {
			throw new NotFoundException("Actor not found");
		}
		return deletedActor;
	}
}

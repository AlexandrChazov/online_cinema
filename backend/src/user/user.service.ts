import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { genSalt, hash } from "bcryptjs";

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async getUserById(_id: string) {
		const user = await this.UserModel.findById(_id).exec();
		if (!user) throw new NotFoundException("User not found");
		return user;
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.getUserById(_id);
		const userWithSameEmail = await this.UserModel.findOne({
			email: dto.email
		}).exec();
		if (userWithSameEmail && _id !== String(userWithSameEmail._id)) {
			throw new NotFoundException("Email is busy");
		}
		user.email = dto.email;
		if (dto.password) {
			const salt = await genSalt(7);
			user.password = await hash(dto.password, salt);
		}
		if (dto.isAdmin !== undefined) {
			// тут ошибка, пользователь может сам себе добавить права админа
			user.isAdmin = dto.isAdmin;
		}
		await user.save();
	}

	async getUsersCount(): Promise<number> {
		return await this.UserModel.find().count().exec();
		// запросы Mongoose не являются промисами, они возвращают "thenable", это не совсем промис хотя и похож
		// "exec()" пишется для возвращения реального промиса
		// иначе вторым параметром нужно передавать колбэк User.findOne({ name: 'daniel' }, function (err, user) {}
	}

	async searchUsers(searchTerm?: string) {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, "ig")
					}
				]
			};
		}

		return await this.UserModel.find(options)
			.select("-password -updatedAt -v") // отбрасываем св-ва, которые нам не нужны
			.sort({ createdAt: "desc" }) // сверху списка будут те юзеры, которые зарегались раньше остальных
			.exec();
		// запросы Mongoose не являются промисами, они возвращают "thenable", это не совсем промис хотя и похож
		// "exec()" пишется для возвращения реального промиса
		// иначе вторым параметром нужно передавать колбэк User.findOne({ name: 'daniel' }, function (err, user) {}
	}

	async delete(id: string) {
		return await this.UserModel.findByIdAndDelete(id).exec();
		// запросы Mongoose не являются промисами, они возвращают "thenable", это не совсем промис хотя и похож
		// "exec()" пишется для возвращения реального промиса
		// иначе вторым параметром нужно передавать колбэк User.findOne({ name: 'daniel' }, function (err, user) {}
	}
}

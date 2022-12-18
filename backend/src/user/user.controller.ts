import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { User } from "./decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { Types } from "mongoose";
import { UserModel } from "./user.model";

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("profile")
	@Auth()
	async getProfile(@User("_id") _id: string) {
		return this.userService.getUserById(_id);
	}

	@UsePipes(new ValidationPipe())
	@Put("profile")
	@HttpCode(200)
	@Auth()
	async updateProfile(@User("_id") _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto);
	}

	@Get("profile/favorites")
	@Auth()
	async getFavoriteMovies(@User("_id") _id: Types.ObjectId) {
		return this.userService.getFavoriteMovies(_id);
	}

	@Put("profile/favorites")
	@HttpCode(200)
	@Auth()
	async toggleFavorite(
		@Body("movieId", IdValidationPipe) movieId: Types.ObjectId,
		@User() user: UserModel
	) {
		return this.userService.toggleFavorite(movieId, user);
	}

	@Get("count")
	@Auth("admin")
	async getUsersCount() {
		return this.userService.getUsersCount();
	}

	@Get()
	@Auth("admin")
	async searchUsers(@Query("searchTerm") searchTerm?: string) {
		return this.userService.searchUsers(searchTerm);
	}

	@Get(":id")
	@Auth("admin")
	async getUserById(@Param("id", IdValidationPipe) id: string) {
		return this.userService.getUserById(id);
	}

	@UsePipes(new ValidationPipe())
	@Put(":id")
	@HttpCode(200)
	@Auth("admin")
	async updateUser(
		@Param("id", IdValidationPipe) _id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(_id, dto);
	}

	@UsePipes(new ValidationPipe())
	@Delete(":id")
	@HttpCode(200)
	@Auth("admin")
	async deleteUser(@Param("id", IdValidationPipe) _id: string) {
		return this.userService.delete(_id);
	}
}

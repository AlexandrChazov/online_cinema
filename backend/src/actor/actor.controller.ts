import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from "@nestjs/common";
import { Auth } from "../auth/decorators/auth.decorator";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { ActorService } from "./actor.service";
import { ActorDto } from "./actor.dto";

@Controller("actors")
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Get("by-slug/:slug")
	async getActorBySlug(@Param("slug") slug: string) {
		return this.actorService.getActorBySlug(slug);
	}

	@Get()
	async getAllActors(@Query("searchTerm") searchTerm?: string) {
		return this.actorService.getAllActors(searchTerm);
	}

	@Get(":id")
	@Auth("admin")
	async getActorById(@Param("id", IdValidationPipe) id: string) {
		return this.actorService.getActorById(id);
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth("admin")
	async create() {
		return this.actorService.create();
	}

	@UsePipes(new ValidationPipe())
	@Put(":id")
	@HttpCode(200)
	@Auth("admin")
	async update(
		@Param("id", IdValidationPipe) id: string,
		@Body() dto: ActorDto
	) {
		return await this.actorService.update(id, dto);
	}

	@Delete(":id")
	@HttpCode(200)
	@Auth("admin")
	async delete(@Param("id", IdValidationPipe) id: string) {
		return this.actorService.delete(id);
	}
}

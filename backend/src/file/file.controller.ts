import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseInterceptors
} from "@nestjs/common";
import { FileService } from "./file.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileResponse } from "./file.interface";

@Controller("files")
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@HttpCode(200)
	@Auth("admin")
	@UseInterceptors(FileInterceptor("image"))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query("folder") folder?: string
	): Promise<FileResponse[]> {
		return await this.fileService.saveFiles([file], folder);
	}
}
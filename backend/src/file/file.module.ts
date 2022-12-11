import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { path } from "app-root-path";

@Module({
	imports: [
		// чтобы папка uploads стала статичной и можно было получать файлы через GET запрос по url
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`, // можно обойтись и без библиотеки: join(__dirname, '..', 'uploads')
			serveRoot: "/uploads" // если не указать то будет отправляться файл "index.html"
		})
	],
	controllers: [FileController],
	providers: [FileService]
})
export class FileModule {}

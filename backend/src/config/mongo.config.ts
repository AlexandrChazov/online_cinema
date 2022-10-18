import { TypegooseModuleOptions } from "nestjs-typegoose";
import { ConfigService } from "@nestjs/config";

// конфиг сервис нужен для удобного доступа к .env файлам
export const getMongoDbConfig = async (
	configService: ConfigService
): Promise<TypegooseModuleOptions> => ({
	uri: configService.get("MONGO_URI")
});

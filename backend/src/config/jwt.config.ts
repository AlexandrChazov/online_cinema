import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

// конфиг сервис нужен для удобного доступа к .env файлам
export const getJWTConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: configService.get("JWT_SECRET")
});

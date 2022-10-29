import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypegooseModule } from "nestjs-typegoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModel } from "../user/user.model";
import { JwtModule } from "@nestjs/jwt";
import { getJWTConfig } from "../config/jwt.config";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
	controllers: [AuthController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: "User" // название колекции
				}
			}
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig
		})
	],
	providers: [AuthService, JwtStrategy]
})
export class AuthModule {}

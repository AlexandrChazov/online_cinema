import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypegooseModule } from "nestjs-typegoose";
import { ConfigModule } from "@nestjs/config";
import { UserModel } from "../user/user.model";

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
		ConfigModule
	],
	providers: [AuthService]
})
export class AuthModule {}

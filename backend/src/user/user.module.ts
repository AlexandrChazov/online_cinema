import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypegooseModule } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ConfigModule } from "@nestjs/config";

@Module({
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
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule {}

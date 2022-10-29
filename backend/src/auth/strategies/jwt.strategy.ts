import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "nestjs-typegoose";
import { UserModel } from "../../user/user.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService, // для доступа к файлу .env
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get<string>("JWT_SECRET")
		});
	}

	async validate({ _id }: Pick<UserModel, "_id">) {
		return await this.UserModel.findById({ _id }).exec(); // exec - execute для выполнения запроса
	}
}

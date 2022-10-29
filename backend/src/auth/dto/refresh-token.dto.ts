import { IsString } from "class-validator";

export class RefreshTokenDto {
	@IsString({
		message: "Should be a string"
	})
	refreshToken: string;
}

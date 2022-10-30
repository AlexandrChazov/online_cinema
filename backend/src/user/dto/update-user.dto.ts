import {
	IsBoolean,
	IsEmail,
	IsOptional,
	IsString,
	MinLength
} from "class-validator";

export class UpdateUserDto {
	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	@MinLength(6, {
		message: "Password can't be less than 6 characters"
	})
	password?: string;

	@IsOptional()
	@IsBoolean()
	isAdmin?: boolean;
}

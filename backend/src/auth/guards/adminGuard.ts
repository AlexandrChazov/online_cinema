import {
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserModel } from "../../user/user.model";

export class AdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: UserModel }>();

		// метод validate класса JwtStrategy ранее добавил к объекту Request объект user с данными пользователя
		const user = request.user;

		if (!user.isAdmin) throw new ForbiddenException("You have no rights");
		return user.isAdmin;
	}
}

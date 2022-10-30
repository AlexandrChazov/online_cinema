import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserModel } from "../user.model";

type TypeData = keyof UserModel;

// https://docs.nestjs.com/custom-decorators
export const User = createParamDecorator(
	(data: TypeData, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();

		// метод validate класса JwtStrategy ранее добавил к объекту Request объект "user" с данными пользователя
		const user = request.user;
		return data ? user[data] : user;
	}
);

import { TypeRole } from "../auth.interface";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt.quard";
import { AdminGuard } from "../guards/adminGuard";

export const Auth = (role: TypeRole = "user") =>
	applyDecorators(
		role === "admin"
			? UseGuards(JwtAuthGuard, AdminGuard)
			: UseGuards(JwtAuthGuard)
	);

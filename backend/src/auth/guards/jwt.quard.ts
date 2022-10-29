import { AuthGuard } from "@nestjs/passport";

// чтобы не писать каждый раз @AuthGuard("jwt"), нам будет достаточно написать @JwtAuthGuard()
export class JwtAuthGuard extends AuthGuard("jwt") {}

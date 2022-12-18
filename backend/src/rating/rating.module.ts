import { Module } from "@nestjs/common";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";
import { TypegooseModule } from "nestjs-typegoose";
import { RatingModel } from "./rating.model";
import { MovieModule } from "../movie/movie.module";

@Module({
	controllers: [RatingController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: RatingModel,
				schemaOptions: {
					collection: "Rating" // название колекции
				}
			}
		]),
		MovieModule // т.к. мы будем использовать сервисы Movie в сервисе Rating
	],
	providers: [RatingService]
})
export class RatingModule {}

import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform
} from "@nestjs/common";
import { Types } from "mongoose";

export class IdValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata): any {
		if (metadata.type !== "param") return value;

		// если тип параметра не совпадает с дефолтным типом _id в MongoDB
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException("Invalid param format - id");
		}
		return value;
	}
}

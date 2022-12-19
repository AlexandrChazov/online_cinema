import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { getTelegramConfig } from "../config/telegram.config";
import { ITelegram } from "./telegram.interface";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: ITelegram;

	constructor() {
		this.options = getTelegramConfig();
		this.bot = new Telegraf(this.options.token);
	}

	async sendMessage(
		message: string,
		options?: ExtraReplyMessage,
		chatId: string = this.options.chatId
	) {
		await this.bot.telegram.sendMessage(chatId, message, {
			parse_mode: "HTML", // чтобы теги HTML нормально преобразовывались и их не было видно в сообщении
			...options
		});
	}

	async sendPhoto(
		photo: string,
		message?: string,
		chatId: string = this.options.chatId
	) {
		await this.bot.telegram.sendPhoto(
			chatId,
			photo,
			message
				? {
						caption: message
				  }
				: {}
		);
	}
}

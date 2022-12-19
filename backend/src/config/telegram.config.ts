import { ITelegram } from "../telegram/telegram.interface";

export const getTelegramConfig = (): ITelegram => ({
	// id пользователя, которому нужно отправить уведомление
	// если мы хотим отправлять уведомления всем пользователям, которые подписаны на канал
	// нужно каким-то образом получить массив id подписанных пользователей
	// https://api.telegram.org/bot5070807616:5839363044:AAGKzNbA0XNcoFquuPKbRLqc9d2Y1cvn9aA/getUpdates - for get chat.id
	chatId: "-403014098",

	// токен нам выдаёт "BotFather" после создания нового бота
	token: "5839363044:AAGKzNbA0XNcoFquuPKbRLqc9d2Y1cvn9aA"
});

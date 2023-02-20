import TelegramBot from "node-telegram-bot-api";
import { bot } from "../bot.js";
import { isMaintenance, setMaintenance } from "../data/config.js";

export async function Action(query: TelegramBot.CallbackQuery) {
    if (query.message?.text === "Вы открыли админ-панель:") {
        if (query.data === "maintenance") {
            setMaintenance();
            await bot.editMessageReplyMarkup({
                inline_keyboard: [
                    [{text: isMaintenance ? "Отключить технического обслуживания" : "Включить режим технического обслуживания", callback_data: "maintenance"}],
                    [{text: "Выполнить запрос в базу данных", callback_data: "query"}],
                    [{text: "Изменить данные пользователя", callback_data: "data"}],
                    [{text: "Изменить список карт", callback_data: "card"}],
                    [{text: "Удалить пользователя из топа", callback_data: "topingnore"}],
                    [{text: "Выйти", callback_data: "back"}],
                ]
            }, {
                message_id: query.message.message_id,
                chat_id: query.message.chat.id,
            });
            await bot.answerCallbackQuery(query.id, {
                text:  `Вы ${isMaintenance ? "включили" : "выключили"} режим технического обслуживания!`
            })

        }
    }
};
import TelegramBot from "node-telegram-bot-api";
import { isAdmin } from "../../api/api.js";
import { bot } from "../../bot.js";
import { cards, isMaintenance, sql, usersInDB } from "../../data/config.js";

export async function adminpanel(message: TelegramBot.Message) {
    try {
        if (!usersInDB.has(message.from?.id)) {
            await sql.query(`INSERT INTO users (name, id, bals, coins, time, isAdmin, resets, level, vip, vipcoins, cards, packs, bafs) values ('${message.from?.username}', ${message.from?.id}, 0, 0, 0, false, 0, 0, 0, 0, ARRAY[]::integer[], ARRAY[]::integer[], ARRAY[]::integer[])`);
        }
    } catch {} finally {
        usersInDB.add(message.from?.id);
    }

    if (!(await isAdmin(message.from!.id))) {
        return;
    };

    try {
        await bot.sendMessage(message.chat.id, `Вы открыли админ-панель:`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: isMaintenance ? "Отключить технического обслуживания" : "Включить режим технического обслуживания", callback_data: "maintenance"}],
                    [{text: "Выполнить запрос в базу данных", callback_data: "query"}],
                    [{text: "Изменить данные пользователя", callback_data: "data"}],
                    [{text: "Изменить список карт", callback_data: "card"}],
                    [{text: "Удалить пользователя из топа", callback_data: "topingnore"}],
                    [{text: "Выйти", callback_data: "back"}],
                ]
            },
            reply_to_message_id: message.message_id,
        })
    } catch {}
};

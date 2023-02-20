import TelegramBot from "node-telegram-bot-api";
import { formattedText, isAdmin } from "../../api/api.js";
import { bot } from "../../bot.js";
import { cards, isMaintenance, sql, usersInDB } from "../../data/config.js";

export async function stats(message: TelegramBot.Message) {
    try {
        if (!usersInDB.has(message.from?.id)) {
            await sql.query(`INSERT INTO users (name, id, bals, coins, time, isAdmin, resets, level, vip, vipcoins, cards, packs, bafs) values ('${message.from?.username}', ${message.from?.id}, 0, 0, 0, false, 0, 0, 0, 0, ARRAY[]::integer[], ARRAY[]::integer[], ARRAY[]::integer[])`)
        }
    } catch (e) {
    } finally {
        usersInDB.add(message.from?.id);
    }

    if (!(await isAdmin(message.from!.id)) && isMaintenance) {
        return;
    };

    try {
        const data = (await sql.query("SELECT * FROM users ORDER BY bals DESC")).rows;
        let position = NaN;
        data.forEach((v, i) => {
            if (Number(v.id) === message.from?.id) {
                position = i;
            };
        });
        await bot.sendMessage(message.chat.id, `Статистика вашего профиля:

Место в топе: ${position+1}
Число баллов: ${formattedText(data[position].bals)}
Число ДрагенКоинов: ${formattedText(data[position].coins)}
${data[position].vip - Date.now() < 0 ? "" : `Вип: ${new Date(data[position].vip - Date.now()).toDateString()}`}
Открыто карт: ${data[position].cards.length} из ${cards.length}`, {
            parse_mode: "HTML",
            reply_to_message_id: message.message_id,
        });
    } catch {};
};

import TelegramBot from "node-telegram-bot-api";
import { formattedText, isAdmin } from "../../api/api.js";
import { bot } from "../../bot.js";
import { cards, isMaintenance, sql, usersInDB } from "../../data/config.js";

export async function top(message: TelegramBot.Message) {
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

        let messageToSend = `🔗 Рейтинг игроков по Количеству Баллов:

🧬 1 — <a href='https://t.me/${data[0].name}'>${data[0].name}</a> [${formattedText(data[0].bals)} Баллов]`;

        data.forEach((v, i) => {
            if (i === 0 || i >= 10) return;
            messageToSend+=`\n${i+1}. <a href='https://t.me/${v.name}'>${v.name}</a> [${formattedText(v.bals)} Баллов]`
        });
        await bot.sendMessage(message.chat.id, messageToSend + `   
Ваше место в топе: ${position+1} [${formattedText(data[position].bals)} Баллов]`, {
            parse_mode: "HTML",
            reply_to_message_id: message.message_id,
        })
    } catch (e) {
    };
};

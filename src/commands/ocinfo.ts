import TelegramBot from "node-telegram-bot-api";
import { isAdmin } from "../../api/api.js";
import { bot } from "../../bot.js";
import { cards, isMaintenance, sql, usersInDB } from "../../data/config.js";

export async function ocinfo(message: TelegramBot.Message) {
    try {
        if (!usersInDB.has(message.from?.id)) {
            await sql.query(`INSERT INTO users (name, id, bals, coins, time, isAdmin, resets, level, vip, vipcoins, cards, packs, bafs) values ('${message.from?.username}', ${message.from?.id}, 0, 0, 0, false, 0, 0, 0, 0, ARRAY[]::integer[], ARRAY[]::integer[], ARRAY[]::integer[])`);
        }
    } catch {} finally {
        usersInDB.add(message.from?.id);
    }

    if (!(await isAdmin(message.from!.id)) && isMaintenance) {
        return;
    };

    try {
        await bot.sendMessage(message.chat.id, `<b>Информация 🔮</b>
<i>Каждые 30 минут вы можете написать /oc и открыть 1 карту, всего в игре ${cards.length} карт.
Среди этих карт есть свои редкости за которые дают разное количество Баллов для Рейтинга и Драгенкоинов, за которые можно открыть Редкий Сундук, где не падает Обычная карта, а падают только карты высшей степени.
                        
🍪 Редкости: 
                    
Обычная [Шанс 90%] (с применением Редкого сундука [Шанс 0%])
                        
Средняя: [Шанс 5%] (с применением Редкого сундука [Шанс 80%])
                        
Магическая: [Шанс 3%] (с применением Редкого сундука [Шанс 10%])
                        
Легендарная:  [Шанс 1.2%] (с применением Редкого сундука [Шанс 5%])
                        
Мифическая: [Шанс 0.8%] (с применением Редкого сундука [Шанс 3%])
                          
Спецаильная: [Шанс 2%] (Падает только с редкого сунудка)
                        
Первосходная: [Шанс 0.01%] (с применением Редкого сунудка [Шанс 0.1%])
                        
» Что-бы посмотреть Рейтинг игроков напишите /top 
                        
» Что-бы посмотреть свою статистику, напишите /stats</i>`, {
        parse_mode: "HTML",
        reply_to_message_id: message.message_id,
    });
    } catch {};
};

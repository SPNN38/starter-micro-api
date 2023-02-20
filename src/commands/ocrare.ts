import { readFile } from "fs";
import TelegramBot from "node-telegram-bot-api";
import { formattedText, isAdmin } from "../../api/api.js";
import { bot } from "../../bot.js";
import { Baf, cards, isMaintenance, sql, usersInDB } from "../../data/config.js";

const bafs: {[id: number]: Baf} = {
    36: {type: "coins", baf: 1.1},
    28: {type: "bals", baf: 1.2},
    20: {type: "bals", baf: 1.1},
    32: {type: "bals", baf: 1.4},
    46: {type: "coins", baf: 2.1},
    49: {type: "time", baf: 0.5},
    48: {type: "bals", baf: 2.5},
    33: {type: "bals", baf: 1.5},
}

export async function ocrare(message: TelegramBot.Message) {
    try {
        if (!usersInDB.has(message.from?.id)) {
            await sql.query(`INSERT INTO users (name, id, bals, coins, time, isAdmin, resets, level, vip, vipcoins, cards, packs, bafs) values ('${message.from?.username}', ${message.from?.id}, 0, 0, 0, false, 0, 0, 0, 0, ARRAY[]::integer[], ARRAY[]::integer[], ARRAY[]::integer[])`)
        }
    } catch (e) {
    } finally {
        usersInDB.add(message.from?.id);
    }

    if ((!(await isAdmin(message.from!.id))) && isMaintenance) {
        return;
    };

    try {
        const data = (await sql.query(`SELECT * FROM users WHERE id=${message.from?.id}`)).rows[0];

        if (data.coins < 200) {
            return await bot.sendMessage(message.chat.id, `У вас недостаточно валюты что-бы открыть Редкий сундук. [Цена: 200 ДрагенКоинов]
Не хватает ДрагенКоинов: ${200 - Number(data.coins)}`, {
                parse_mode: "HTML",
                reply_to_message_id: message.message_id
            });
        }
        
        const randomNumber = Math.floor(Math.random() * 1e3);
        const rare = randomNumber <= 800 ? "u" :
            randomNumber <= 900 ? "m" :
            randomNumber <= 950 ? "l" :
            randomNumber <= 980 ? "i" :
            randomNumber <= 999 ? "s" : "p";
        const card = cards[rare][Math.floor((cards[rare].length - 1) * Math.random())];

        let balsBaf = 1.3;
        let coinsBaf = 0.1;     
        (data.bafs as Array<number>).forEach(v => {
        if (bafs[v]?.type === "bals") balsBaf *= bafs[v].baf;
        if (bafs[v]?.type === "coins") coinsBaf *= bafs[v].baf;
        });

        const cardList = new Set(data.cards);
        cardList.add(card);

        const xBals = (3 - 2 * data.cards.length / cards.length) * (2.5 ** data.resets) * balsBaf * (cardList.has(card) ? (2 / ((Math.log(Math.log(data.cards.length) + 1) + 1)) > 1 ? 2 / ((Math.log(Math.log(data.cards.length) + 1) + 1)) : 1) : 1);
        const xCoins = (2 - 1 * data.cards.length / cards.length) * (1.5 ** data.resets) * coinsBaf * (cardList.has(card) ? (2 / ((Math.log(Math.log(data.cards.length) + 1) + 1)) > 1 ? 2 / ((Math.log(Math.log(data.cards.length) + 1) + 1)) : 1) : 1);

        const bals = Math.floor(((
            rare === "u" ? 80 :
            rare === "m" ? 130 :
            rare === "l" ? 200 :
            rare === "i" ? 170 :
            rare === "p" ? 500 : 500
        ) + Math.random() * (rare === "p" ? 500 : 20)) * xBals);
        const coins = Math.floor(((
            rare === "u" ? 20 :
            rare === "m" ? 50 :
            rare === "l" ? 50 :
            rare === "i" ? 70 :
            rare === "p" ? 200 : 0
        ) + Math.random() * (
            rare === "u" ? 10 :
            rare === "m" ? 0 :
            rare === "l" ? 20 :
            rare === "i" ? 20 :
            rare === "p" ? 300 : 0
        )) * xCoins);

        let caption = `• Вы открыли Набор Карт, вам выпала: ${
            rare === "u" ? "Средняя" :
            rare === "m" ? "Магическая" :
            rare === "l" ? "Легендарная" :
            rare === "i" ? "Мифическая" : 
            rare === "s" ? "Первосходная" : "Специальная"
} Карта [Шанс: ${
            rare === "u" ? "80%" :
            rare === "m" ? "10%" :
            rare === "l" ? "5%" :
            rare === "i" ? "3%" :
            rare === "p" ? "0.1%" : "1.9%"
}] ${
            rare === "s" ? "🔗" :
            rare === "u" ? "📘" :
            rare === "m" ? "🌷" :
            rare === "l" ? "🎫" :
            rare === "i" ? "🍹" : "🧬"
} Вы собрали ${bals} Баллов и ${coins} Драгенкоинов.

— Текущее количество баллов: ${formattedText(data.bals + bals)}

— Текущее количество ДрагенКоинов: ${formattedText(data.coins + coins)}

— На данный момент у вас открыто ${cardList.size} карт из ${cards.length}`

    readFile(`./cards/${card}.jpg`, {}, async (err, data) => {
        return await bot.sendPhoto(message.chat.id, data, {caption: caption,
            parse_mode: "HTML",
            reply_to_message_id: message.message_id
        });
    });

    sql.query(`UPDATE users set bals=bals+${bals}, coins=coins+${coins}, time=${Date.now()}, cards=ARRAY${JSON.stringify(Array.from(cardList))}::integer[], bafs=ARRAY${JSON.stringify(Array.from(cardList))}::integer[] WHERE id=${message.from!.id}`)
    } catch (e) {
        console.log(e)
    };
};
import TelegramBot from "node-telegram-bot-api";
import { token } from "./data/config.js";
import express from "express";
import "dotenv/config.js";
import { ocinfo } from "./src/commands/ocinfo.js";
import { oc } from "./src/commands/oc.js";
import { ocrare } from "./src/commands/ocrare.js";
import { stats } from "./src/commands/stats.js";
import { top } from "./src/commands/top.js";
import { adminpanel } from "./src/commands/adminpanel.js";
import { Action } from "./src/actions.js";

export const bot = new TelegramBot(token, {polling: true});

bot.on("callback_query", Action);
bot.onText(/\/ocinfo/, ocinfo);
bot.onText(/\/oc/, oc);
bot.onText(/\/ocrare/, ocrare);
bot.onText(/\/stats/, stats);
bot.onText(/\/top/, top);
bot.onText(/\/adminpanel/, adminpanel)

if (process.env.PRODUCTION) {
    const app = express();
    app.use(express.json());
    app.listen(process.env.PORT || 8888); 
    bot.setWebHook(process.env.URL || "");
}
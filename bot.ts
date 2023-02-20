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

export const bot = new TelegramBot(token);

bot.on("callback_query", Action);
bot.onText(/\/ocinfo/, ocinfo);
bot.onText(/\/oc/, oc);
bot.onText(/\/ocrare/, ocrare);
bot.onText(/\/stats/, stats);
bot.onText(/\/top/, top);
bot.onText(/\/adminpanel/, adminpanel)

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`https://blue-green-snapper-cape.cyclic.app/bot6140339422:AAEkNNZC3usvp_OIRy41ld64KiqcqIiuhc0`);
const app = express();

// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.post(`/bot6140339422:AAEkNNZC3usvp_OIRy41ld64KiqcqIiuhc0`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Express server is listening on ${process.env.PORT}`);
});
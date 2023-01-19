import Bot from "./Bot.js";
import { config } from "dotenv";
config()

const { BOT_TOKEN, WEBHOOK_URL } = process.env
const bot = new Bot(BOT_TOKEN)
await bot.setWebhook(WEBHOOK_URL)
  .catch(e => {
    console.log(e)
    process.exit()
  })

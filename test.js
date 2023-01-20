import Bot from "./Bot.js";
import { config } from "dotenv";
config()

const { BOT_TOKEN, WEBHOOK_URL } = process.env
const bot = new Bot(BOT_TOKEN)

async function foo () {
  console.log(await bot.getMe())
}

foo()

setTimeout(() => {}, 3000)
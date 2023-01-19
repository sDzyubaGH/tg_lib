import express from 'express'
import { config } from 'dotenv'
import Bot from './Bot.js'
import bodyParser from 'body-parser'

config()

const { PORT, WEBHOOK_URL, BOT_TOKEN } = process.env

const URI = `/webhook/${BOT_TOKEN}`

const app = express()
app.use(bodyParser.json())

const bot = new Bot(BOT_TOKEN)

const init = async () => {
  const URI = await bot.setWebhook(WEBHOOK_URL)
    .catch(e => {
      console.log(e.message)
      process.exit()
    })
  console.log(URI)
}

app.post(URI, async (req, res) => {
  const update = req.body
  const message = update?.message?.text || ''

  const chatId = update?.message?.chat.id
  // console.log(chatId)

  await bot.sendMessage(chatId, 'some text')
  res.status(200).send('ok')
})

app.listen(PORT, async () => {
  console.log('Application started on port:', PORT)
  await init()
})

import axios from 'axios'
import { FatalError } from './src/core/errors.js'
import Document from './Types/Document.js'
import InlineKeyboardButton from './Types/InlineKeyboardButton.js'
import InlineKeyboardMarkup from './Types/InlineKeyboardMarkup.js'

class Bot {
  constructor(token) {
    this._TOKEN = token
    this._TELEGRAM_API = `https://api.telegram.org/bot${token}`
  }

  async getMe() {
    console.log()
    const query = `${this._TELEGRAM_API}/getMe`
    try {
      const res = await axios.get(query)
      return res.data
    } catch (e) {
      console.error(e.message)
    }
  }

  async setWebhook(webhookURL) {
    const query = `${this._TELEGRAM_API}/setWebhook?url=${webhookURL}/webhook/${this._TOKEN}&drop_pending_updates=true`
    console.log(query)

    // unset webhook
    await axios.get(`${this._TELEGRAM_API}/deleteWebhook`)
      .then(res => {
        if (res.data.ok) {
          console.log('Webhook was unset')
        }
      })
      .catch(e => {
        console.log('Webhook delition error')
        throw e
      })

    await axios.get(query)
      .then(res => {
        if (res.data.ok) {
          console.log('Webhook was set')
        }
      })
      .catch(e => {
        console.log('Webhook was not set')
        throw e
      })

    return `webhook/${this._TOKEN}`
  }

  _buildUrl(methodName) {
    return `${this._TELEGRAM_API}/${methodName}`
  }

  async _request(methodName, options = {}) {
    if (!this._TOKEN) {
      throw new FatalError('Telegram bot token not provided!')
    }

    if (options.inlineKeyboardMarkup) {
      // const buttonsRow = new InlineKeyboardButton(options.inlineKeyboardMarkup.)
      // this.inlineKeyboardMarkup = new InlineKeyboardMarkup()
    }

    const url = this._buildUrl(methodName)
    const response = await axios.post(url, options)
      .catch(e => {
        console.error(e.response.data)
        throw e
      })

    return response
  }

  async sendMessage(chatId, text) {
    const options = {
      chat_id: chatId,
      text
    }

    const response = this._request('sendMessage', options)
      .catch(e => {
        console.log('Message sending error:', e.message)
      })
    return response
  }

  async sendDocument(chatId, value, filename = null) {
    const document = new Document(value, filename)
    const formData = document.getFormData()


    const query = this.getMethod('sendDocument')

    const response = await axios.post(query, formData, {
      headers: formData.getHeaders()
    })
      .catch(e => {
        console.log(`Send document error: ${e.message}`)
        throw e
      })

    return response
  }
}

export default Bot
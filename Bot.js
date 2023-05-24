import axios from 'axios'
import { FatalError, TelegramError } from './src/core/errors.js'
import FormData from 'form-data'
import * as fs from 'fs'
import download from 'download'
import ReplyKeyboardRemove from './Types/ReplyKeyboardMarkup/ReplyKeyboardRemove.js'
import 'dotenv/config'

class Bot {
  constructor(token) {
    this._TOKEN = token
    this._TELEGRAM_API = `https://api.telegram.org`
  }

  async getMe() {
    const query = `${this._TELEGRAM_API}/getMe`
    try {
      const res = await axios.get(query)
      return res.data
    } catch (e) {
      console.error(e.message)
    }
  }

  async setWebhook(webhookURL) {
    const options = {
      url: webhookURL,
      drop_pending_updates: true
    }
    try {
      const response = await this._request('setWebhook', options)
      return response
    } catch (error) {
      throw error
    }
  }

  _buildUrl(methodName = '', filePath = '') {
    let url = this._TELEGRAM_API
    if (filePath) {
      url += `/file/bot${this._TOKEN}/${filePath}`
      return url
    }
    // if (imagePath) {
    //   url += `/image/bot${this._TOKEN}/${imagePath}`
    //   return url
    // }
    return `${url}/bot${this._TOKEN}/${methodName}`
  }

  async _request(methodName, options = {}) {
    if (!this._TOKEN) {
      throw new FatalError('Telegram bot token not provided!')
    }

    // if (options.inlineKeyboardMarkup) {
    //   // const buttonsRow = new InlineKeyboardButton(options.inlineKeyboardMarkup.)
    //   // this.inlineKeyboardMarkup = new InlineKeyboardMarkup()
    // }

    const url = this._buildUrl(methodName)
    try {
      const response = await axios.post(url, options)
      return response
    } catch (error) {
      throw new TelegramError(error.message, error.response)
    }
  }

  async sendMessage(chatId, text, optionalParams = { disable_web_page_preview: false, replyMarkup: {}, resize_keyboard: false, parse_mode: null }) {
    const { disable_web_page_preview, replyMarkup, resize_keyboard, parse_mode } = optionalParams
    const options = {
      chat_id: chatId,
      text,
      resize_keyboard,
    }

    if (replyMarkup?.inlineKeyboard) {
      options.reply_markup = replyMarkup.inlineKeyboard
    }
    if (replyMarkup?.replyKeyboard) {
      options.reply_markup = replyMarkup.replyKeyboard
    }
    if (replyMarkup?.replyKeyboardRemove) {
      options.reply_markup = new ReplyKeyboardRemove()
    }
    if (disable_web_page_preview) {
      options.disable_web_page_preview = true
    }
    if (parse_mode) {
      options.parse_mode = parse_mode
    }

    try {
      const response = await this._request('sendMessage', options)
      return response
    } catch (error) {
      throw error
    }
  }

  async answerCallbackQuery(callback_query_id) {
    const options = {
      callback_query_id
    }
    const response = await this._request('answerCallbackQuery', options)
    return response
  }

  async editMessageReplyMarkup(message_id, chat_id, reply_markup) {
    const options = {
      message_id,
      chat_id,
      reply_markup
    }
    const response = await this._request('editMessageReplyMarkup', options)
    return response.data
  }

  async editMessageText(chatId, message_id, text, replyMarkup = null, parse_mode = 'HTML') {
    const options = {
      chat_id: chatId,
      text,
      message_id,
      parse_mode
    }
    if (replyMarkup) {
      options.reply_markup = replyMarkup
    }
    try {
      const response = await this._request('editMessageText', options)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  async sendDocument(chatId, value, filename = null) {
    try {
      // const document = new Document(value, filename)
      // const formData = document.getFormData(chatId)
      const formData = new FormData()
      formData.append('chat_id', chatId)
      formData.append('document', value, filename)
      const url = this._buildUrl('sendDocument')
      const response = await axios({
        method: 'post',
        url: url,
        data: formData,
        headers: formData.getHeaders()
      })
      return response
    } catch (e) {
      if (e instanceof TelegramError)
        throw new TelegramError('document sending error', e.response)
      throw e
    }
  }

  async _getFile(fileId) {
    try {
      const url = this._buildUrl('getFile')
      const options = {
        file_id: fileId
      }
      const response = await axios.post(url, options)
      return response.data.result
    } catch (e) {
      if (e instanceof TelegramError) {
        throw new TelegramError('getFile error', e.response)
      }
      throw e
    }
  }

  // async _download(url, filename) {
  //   // to join the path correctly 
  //   // const filePath = path.resolve(__dirname, filename ? filenawme : 'image.jpg')
  //   try {
  //     const writer = fs.createWriteStream('./files/' + filename)

  //     const response = await axios.get(url, {
  //       responseType: 'stream'
  //     })

  //     response.data.pipe(writer)

  //     return new Promise((resolve, reject) => {
  //       writer.on('finish', resolve)
  //       writer.on('error', reject)
  //     })
  //   } catch (e) {
  //     throw e
  //   }
  // }

  async downloadFile(fileId) {
    const fileData = await this._getFile(fileId)
    const { file_path } = fileData
    const url = this._buildUrl('', file_path)
    const file = await download(url)
    return file
  }
}

export default Bot
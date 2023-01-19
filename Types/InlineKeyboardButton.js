class InlineKeyboardButton {
  text = ''
  callback_data = ''

  constructor(text, callback_data) {
    this.text = text
    this.callback_data = JSON.stringify(callback_data)
  }
}

export default InlineKeyboardButton
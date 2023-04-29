class InlineKeyboardButton {
  text = ''
  callback_data = ''

  constructor(text, callback_data) {
    this.text = text

    if (typeof (callback_data) === 'object')
      this.callback_data = JSON.stringify(callback_data)
    else this.callback_data = callback_data
  }
}

export default InlineKeyboardButton
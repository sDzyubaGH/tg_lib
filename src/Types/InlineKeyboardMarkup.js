class InlineKeyboardMarkup {
  inline_keyboard = []

  constructor(buttonRows) {
    buttonRows.forEach(buttonRow => {
      this.inline_keyboard.push(buttonRow)
    });
  }
}

export default InlineKeyboardMarkup
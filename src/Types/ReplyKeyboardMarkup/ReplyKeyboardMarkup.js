class ReplyKeyboardMarkup {
  constructor(arrayOfArrayButtons, /*isPersistant = false,*/ resize_keyboard = false) {
    this.keyboard = arrayOfArrayButtons
    // this.isPersistant = isPersistant
    this.resize_keyboard = resize_keyboard
  }
}

export default ReplyKeyboardMarkup
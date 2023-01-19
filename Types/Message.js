class Message {
  constructor(message_id, chat, date, document) {
    this.message_id = message_id
    this.date = date
    this.chat = chat
    this.document = document
  }
}

export default Message
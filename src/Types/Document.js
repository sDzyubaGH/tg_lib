import FormData from "form-data"

class Document {
  constructor(value, filename = null) {
    this.value = value
    this.filename = filename
  }

  getFormData(chatId) {
    const formData = new FormData()

    formData.append('chat_id', chatId)
    this.filename
      ? formData.append('document', this.value, this.filename)
      : formData.append('document', this.value)
    return formData
  }
}

export default Document











































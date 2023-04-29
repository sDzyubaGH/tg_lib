export class BaseError extends Error {
  constructor(errorCode, message) {
    super(`${errorCode}: ${message}`)
    this.code = errorCode
  }
}

export class TelegramError extends BaseError {
  constructor(message, response) {
    super('ETELEGRAM', message)
    this.response = response
  }
}

export class FatalError extends BaseError {
  constructor(data) {
    const error = (typeof data === 'string') ? null : data;
    const message = error ? error.message : data;
    super('EFATAL', message);
    if (error) this.stack = error.stack;
  }
};
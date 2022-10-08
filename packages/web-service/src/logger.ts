import { Message } from '@sugarteam/web-messager';

export type LogOption = boolean | {
  ignore: Array<string>
}

export default class Logger {
  option: LogOption = false;
  namespace: string = '';
  constructor(option: LogOption, namespace: string) {
    this.option = option;
    this.namespace = namespace;
  }

  logMessage(tip: string, message: Message) {
    if (!this.option) return;

    let prefixText = `[WebService][${this.namespace}] ${tip}`;

    if (this.option === true) {
      console.info(prefixText, message)
    } else {
      const { ignore } = this.option;
      if (ignore.indexOf(message.type) === -1) {
        console.info(prefixText, message);
      }
    }
  }

  info(...args) {
    if (!this.option) return;
    console.info(...args);
  }
}
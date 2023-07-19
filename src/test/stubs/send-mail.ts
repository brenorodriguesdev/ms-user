import { type SendMail } from '../../data/contracts/send-mail'

export class SendMailStub implements SendMail {
  async send (): Promise<void> {
  }
}

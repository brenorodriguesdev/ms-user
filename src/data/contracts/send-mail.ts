export interface SendMailData {
  email: string
  name: string
  title: string
  body: string
}

export interface SendMail {
  send: (data: SendMailData) => Promise<void>
}

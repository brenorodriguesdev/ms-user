import { type Encrypter } from '../../data/contracts/encrypter'

export class EncrypterStub implements Encrypter {
  async encrypt (): Promise<string> {
    return 'token'
  }
}

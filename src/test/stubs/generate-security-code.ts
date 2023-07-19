import { type GenerateSecurityCode } from '../../data/contracts/generate-security-code'

export class GenerateSecurityCodeStub implements GenerateSecurityCode {
  async generate (): Promise<string> {
    return 'any_code'
  }
}

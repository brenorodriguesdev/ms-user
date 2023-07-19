import { type SecurityCodeRepository } from '../../data/contracts/security-code-repository'
import { type SecurityCodeEntity } from '../../data/entities/security-code'
import { securityCodeMock } from '../mocks/security-code'

export class SecurityCodeRepositoryStub implements SecurityCodeRepository {
  async create (): Promise<SecurityCodeEntity> {
    return securityCodeMock
  }
}

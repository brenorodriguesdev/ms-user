import { type SecurityCodeEntity } from '../entities/security-code'

export interface SecuritCodeRepository {
  create: (securityCode: SecurityCodeEntity) => Promise<SecurityCodeEntity>
}

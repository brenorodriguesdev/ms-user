import { type SecurityCodeEntity } from '../entities/security-code'

export interface SecurityCodeRepository {
  create: (securityCode: SecurityCodeEntity) => Promise<SecurityCodeEntity>
}

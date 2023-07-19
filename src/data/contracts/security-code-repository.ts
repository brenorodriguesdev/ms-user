import { type SecurityCodeEntity } from '../entities/security-code'

export interface SecurityCodeRepository {
  create: (securityCode: SecurityCodeEntity) => Promise<SecurityCodeEntity>
  findByUserAndCodeAndNotUsedAndExpired: (userId: string, code: string) => Promise<SecurityCodeEntity>
  update: (securityCode: SecurityCodeEntity) => Promise<void>
}

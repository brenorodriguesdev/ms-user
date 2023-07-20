import { type SecurityCodeEntity } from '../entities/security-code'

export interface SecurityCodeRepository {
  create: (securityCode: SecurityCodeEntity) => Promise<SecurityCodeEntity>
  findByUserAndCodeAndNotUsedAndExpired: (idUser: number, code: string) => Promise<SecurityCodeEntity>
  update: (securityCode: SecurityCodeEntity) => Promise<void>
}

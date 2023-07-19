import { type SecurityCodeEntity } from '../../data/entities/security-code'
import { userMock } from './user'

export const securityCodeMock: SecurityCodeEntity = ({
  id: 1,
  user: userMock,
  code: 'any_code',
  used: false,
  expireIn: Date.now() + (1000 * 60 * 60 * 5),
  usedAt: undefined,
  createdAt: Date.now()
})

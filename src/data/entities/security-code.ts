import { type UserEntity } from './user'

export interface SecurityCodeEntity {
  id?: number
  user: UserEntity
  code: string
  used: boolean
  expireIn: number
  usedAt: number
  createdAt: number
}

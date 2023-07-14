import { type ProfileEntity } from './profile'

export interface UserEntity {
  id?: number
  email: string
  name: string
  password: string
  profile: ProfileEntity
}

import { type UserEntity } from '../../data/entities/user'
import { profileMock } from './profile'

export const userMock: UserEntity = ({
  id: 1,
  email: 'email@example.com',
  name: 'John',
  password: 'password_hash',
  profile: profileMock
})

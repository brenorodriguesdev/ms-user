import { type UserEntity } from '../entities/user'

export interface UserRepository {
  findByEmail: (email: string) => Promise<UserEntity>
  create: (user: UserEntity) => Promise<UserEntity>
}

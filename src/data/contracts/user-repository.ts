import { type UserEntity } from '../entities/user'

export interface UserRepository {
  findById: (id: number) => Promise<UserEntity>
  findByEmail: (email: string) => Promise<UserEntity>
  create: (user: UserEntity) => Promise<UserEntity>
  update: (user: UserEntity) => Promise<void>
}

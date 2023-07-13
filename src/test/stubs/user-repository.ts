import { type UserRepository } from '../../data/contracts/user-repository'
import { type UserEntity } from '../../data/entities/user'
import { userMock } from '../mocks/user'

export class UserRepositoryStub implements UserRepository {
  async create (): Promise<UserEntity> {
    return userMock
  }

  async findByEmail (): Promise<UserEntity> {
    return userMock
  }
}

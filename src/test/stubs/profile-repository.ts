import { type ProfileRepository } from '../../data/contracts/profile-repository'
import { type ProfileEntity } from '../../data/entities/profile'
import { profileMock } from '../mocks/profile'

export class ProfileRepositoryStub implements ProfileRepository {
  async findById (): Promise<ProfileEntity> {
    return profileMock
  }
}

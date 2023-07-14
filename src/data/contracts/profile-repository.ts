import { type ProfileEntity } from '../entities/profile'

export interface ProfileRepository {
  findById: (id: number) => Promise<ProfileEntity>
}

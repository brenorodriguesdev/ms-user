import { type SignUpModel } from '../../domain/models/sign-up'
import { type SignUpUseCase } from '../../domain/use-cases/sign-up'
import { type Hasher } from '../contracts/hasher'
import { type ProfileRepository } from '../contracts/profile-repository'
import { type UserRepository } from '../contracts/user-repository'

export class SignUpService implements SignUpUseCase {
  constructor (
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher) {}

  async sign ({ idProfile, email, name, password }: SignUpModel): Promise<void | Error> {
    const user = await this.userRepository.findByEmail(email)
    if (user) {
      return new Error('Esse e-mail já está em uso!')
    }
    const profile = await this.profileRepository.findById(idProfile)
    if (!profile) {
      return new Error('Esse perfil não existe!')
    }
    const passwordHash = await this.hasher.hash(password)
    await this.userRepository.create({
      email,
      name,
      password: passwordHash,
      profile
    })
  }
}

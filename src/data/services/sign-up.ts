import { type SignUpModel } from '../../domain/models/sign-up'
import { type SignUpUseCase } from '../../domain/use-cases/sign-up'
import { type Hasher } from '../contracts/hasher'
import { type UserRepository } from '../contracts/user-repository'

export class SignUpService implements SignUpUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher) {}

  async sign ({ email, name, password }: SignUpModel): Promise<void | Error> {
    const user = await this.userRepository.findByEmail(email)
    if (user) {
      return new Error('Esse e-mail já está em uso!')
    }
    const passwordHash = await this.hasher.hash(password)
    await this.userRepository.create({
      email,
      name,
      password: passwordHash
    })
  }
}

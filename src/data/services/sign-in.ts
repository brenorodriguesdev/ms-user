import { type SignInModel, type SignInResultModel } from '../../domain/models/sign-in'
import { type SignInUseCase } from '../../domain/use-cases/sign-in'
import { type Encrypter } from '../contracts/encrypter'
import { type HasherComparer } from '../contracts/hasher-comparer'
import { type UserRepository } from '../contracts/user-repository'

export class SignInService implements SignInUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly hasherComparer: HasherComparer,
    private readonly encrypter: Encrypter
  ) {}

  async sign ({ email, password }: SignInModel): Promise<SignInResultModel | Error> {
    const user = await this.userRepository.findByEmail(email)
    const error = new Error('Usuário ou senha inválido!')
    if (!user) {
      return error
    }
    const isPasswordValid = await this.hasherComparer.compare(password, user.password)
    if (!isPasswordValid) {
      return error
    }
    const token = await this.encrypter.encrypt(user)
    return {
      name: user.name,
      token,
      permissions: user.profile.permissions
    }
  }
}

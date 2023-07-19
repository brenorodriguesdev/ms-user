import { type UpdatePasswordModel } from '../../domain/models/update-password'
import { type UpdatePasswordUseCase } from '../../domain/use-cases/update-password'
import { type Hasher } from '../contracts/hasher'
import { type HasherComparer } from '../contracts/hasher-comparer'
import { type UserRepository } from '../contracts/user-repository'

export class UpdatePasswordService implements UpdatePasswordUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly hasherComparer: HasherComparer,
    private readonly hasher: Hasher) {}

  async update ({ idUser, passwordOld, passwordNew }: UpdatePasswordModel): Promise<void | Error> {
    const user = await this.userRepository.findById(idUser)
    if (!user) {
      return new Error('Esse usuário não existe!')
    }
    const isValid = await this.hasherComparer.compare(passwordOld, user.password)
    if (!isValid) {
      return new Error('Senha antiga inválida!')
    }
    const password = await this.hasher.hash(passwordNew)
    await this.userRepository.update({ ...user, password })
  }
}

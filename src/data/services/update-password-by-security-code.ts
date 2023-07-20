import { type UpdatePasswordBySecurityCodeModel } from '../../domain/models/update-password-by-security-code'
import { type UpdatePasswordBySecurityCodeUseCase } from '../../domain/use-cases/update-password-by-security-code'
import { type Hasher } from '../contracts/hasher'
import { type SecurityCodeRepository } from '../contracts/security-code-repository'
import { type UserRepository } from '../contracts/user-repository'

export class UpdatePasswordBySecurityCodeService implements UpdatePasswordBySecurityCodeUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly securityCodeRepository: SecurityCodeRepository,
    private readonly hasher: Hasher
  ) {}

  async update ({ idUser, code, passwordNew }: UpdatePasswordBySecurityCodeModel): Promise<void | Error> {
    const user = await this.userRepository.findById(idUser)
    if (!user) {
      return new Error('Esse usuário não existe!')
    }
    const securityCode = await this.securityCodeRepository.findByUserAndCodeAndNotUsedAndExpired(idUser, code)
    if (!securityCode) {
      return new Error('Esse código de segurança é inválido ou já expirou!')
    }
    await this.securityCodeRepository.update({ ...securityCode, used: true, usedAt: Date.now() })
    const password = await this.hasher.hash(passwordNew)
    await this.userRepository.update({ ...user, password })
  }
}

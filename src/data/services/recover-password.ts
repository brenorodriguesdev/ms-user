import { type RecoverPasswordModel } from '../../domain/models/recover-password'
import { type RecoverPasswordUseCase } from '../../domain/use-cases/recover-password'
import { type GenerateSecurityCode } from '../contracts/generate-security-code'
import { type SecurityCodeRepository } from '../contracts/security-code-repository'
import { type SendMail } from '../contracts/send-mail'
import { type UserRepository } from '../contracts/user-repository'
import { type SecurityCodeEntity } from '../entities/security-code'
import { makeBodyRecoverEmail } from '../factories/body-recover-email'

export class RecoverPasswordService implements RecoverPasswordUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly generateSecurityCode: GenerateSecurityCode,
    private readonly securityCodeRepository: SecurityCodeRepository,
    private readonly sendMail: SendMail) {}

  async recover ({ email }: RecoverPasswordModel): Promise<void | Error> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      return new Error('Esse e-mail não existe em nosso banco de dados!')
    }
    const code = await this.generateSecurityCode.generate()
    const fiveMinutes = (1000 * 60 * 60 * 5)
    const securityCode: SecurityCodeEntity = {
      user,
      code,
      used: false,
      expireIn: Date.now() + fiveMinutes,
      usedAt: undefined,
      createdAt: Date.now()
    }
    await this.securityCodeRepository.create(securityCode)
    await this.sendMail.send({
      email: user.email,
      name: user.name,
      title: 'Recuperar Senha',
      body: makeBodyRecoverEmail(user, securityCode.code)
    })
  }
}

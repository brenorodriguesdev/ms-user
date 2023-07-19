import { type RecoverPasswordModel } from '../../domain/models/recover-password'
import { securityCodeMock } from '../../test/mocks/security-code'
import { userMock } from '../../test/mocks/user'
import { GenerateSecurityCodeStub } from '../../test/stubs/generate-security-code'
import { SecurityCodeRepositoryStub } from '../../test/stubs/security-code-repository'
import { SendMailStub } from '../../test/stubs/send-mail'
import { UserRepositoryStub } from '../../test/stubs/user-repository'
import { type GenerateSecurityCode } from '../contracts/generate-security-code'
import { type SecurityCodeRepository } from '../contracts/security-code-repository'
import { type SendMail } from '../contracts/send-mail'
import { type UserRepository } from '../contracts/user-repository'
import { makeBodyRecoverEmail } from '../factories/body-recover-email'
import { RecoverPasswordService } from './recover-password'

interface SutTypes {
  userRepository: UserRepository
  generateSecurityCode: GenerateSecurityCode
  securityCodeRepository: SecurityCodeRepository
  sendMail: SendMail
  sut: RecoverPasswordService
}

const makeSut = (): SutTypes => {
  const sendMail = new SendMailStub()
  const securityCodeRepository = new SecurityCodeRepositoryStub()
  const generateSecurityCode = new GenerateSecurityCodeStub()
  const userRepository = new UserRepositoryStub()
  const sut = new RecoverPasswordService(userRepository, generateSecurityCode, securityCodeRepository, sendMail)
  return {
    sendMail,
    generateSecurityCode,
    securityCodeRepository,
    userRepository,
    sut
  }
}
const makeData = (): RecoverPasswordModel => ({
  email: 'example@example.com'
})

describe('', () => {
  test('should return error if not found e-mail', async () => {
    const { sut, userRepository } = makeSut()
    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null)
    const data = makeData()
    const error = new Error('Esse e-mail não existe em nosso banco de dados!')
    const result = await sut.recover(data)
    expect(findByEmailSpy).toHaveBeenCalledWith(data.email)
    expect(result).toStrictEqual(error)
  })

  test('should return send security code to recover password', async () => {
    const { sut, userRepository, generateSecurityCode, securityCodeRepository, sendMail } = makeSut()
    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail')
    const generateSpy = jest.spyOn(generateSecurityCode, 'generate')
    const createSpy = jest.spyOn(securityCodeRepository, 'create')
    const sendSpy = jest.spyOn(sendMail, 'send')
    const securityCode = securityCodeMock
    jest.spyOn(Date, 'now').mockReturnValueOnce(1)
    jest.spyOn(Date, 'now').mockReturnValueOnce(2)
    const fiveMinutes = (1000 * 60 * 60 * 5)
    securityCode.expireIn = 1 + fiveMinutes
    securityCode.createdAt = 2
    delete securityCode.id
    const data = makeData()
    await sut.recover(data)
    expect(findByEmailSpy).toHaveBeenCalledWith(data.email)
    expect(generateSpy).toHaveBeenCalledTimes(1)
    expect(createSpy).toHaveBeenCalledWith(securityCodeMock)
    expect(sendSpy).toHaveBeenCalledWith({
      email: userMock.email,
      name: userMock.name,
      title: 'Recuperar Senha',
      body: makeBodyRecoverEmail(userMock, securityCode.code)
    })
  })

  test('should throw if findByEmail throws', async () => {
    const { sut, userRepository } = makeSut()
    jest.spyOn(userRepository, 'findByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.recover(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if generate throws', async () => {
    const { sut, generateSecurityCode } = makeSut()
    jest.spyOn(generateSecurityCode, 'generate').mockRejectedValueOnce(new Error())
    const promise = sut.recover(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if create throws', async () => {
    const { sut, securityCodeRepository } = makeSut()
    jest.spyOn(securityCodeRepository, 'create').mockRejectedValueOnce(new Error())
    const promise = sut.recover(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if send throws', async () => {
    const { sut, sendMail } = makeSut()
    jest.spyOn(sendMail, 'send').mockRejectedValueOnce(new Error())
    const promise = sut.recover(makeData())
    await expect(promise).rejects.toThrow()
  })
})

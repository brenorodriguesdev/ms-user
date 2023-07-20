import { type UpdatePasswordBySecurityCodeModel } from '../../domain/models/update-password-by-security-code'
import { securityCodeMock } from '../../test/mocks/security-code'
import { userMock } from '../../test/mocks/user'
import { HasherStub } from '../../test/stubs/hasher'
import { SecurityCodeRepositoryStub } from '../../test/stubs/security-code-repository'
import { UserRepositoryStub } from '../../test/stubs/user-repository'
import { type Hasher } from '../contracts/hasher'
import { type SecurityCodeRepository } from '../contracts/security-code-repository'
import { type UserRepository } from '../contracts/user-repository'
import { UpdatePasswordBySecurityCodeService } from './update-password-by-security-code'

interface SutTypes {
  userRepository: UserRepository
  securityCodeRepository: SecurityCodeRepository
  hasher: Hasher
  sut: UpdatePasswordBySecurityCodeService
}

const makeSut = (): SutTypes => {
  const hasher = new HasherStub()
  const securityCodeRepository = new SecurityCodeRepositoryStub()
  const userRepository = new UserRepositoryStub()
  const sut = new UpdatePasswordBySecurityCodeService(userRepository, securityCodeRepository, hasher)
  return {
    hasher,
    securityCodeRepository,
    userRepository,
    sut
  }
}
const makeData = (): UpdatePasswordBySecurityCodeModel => ({
  idUser: 1,
  code: 'any_code',
  passwordNew: 'passwordNew'
})

describe('UpdatePasswordBySecurityCodeService', () => {
  test('should return error if findById not found a user', async () => {
    const { sut, userRepository } = makeSut()
    const findByIdSpy = jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null)
    const data = makeData()
    const error = new Error('Esse usuário não existe!')
    const result = await sut.update(data)
    expect(findByIdSpy).toHaveBeenCalledWith(1)
    expect(result).toStrictEqual(error)
  })

  test('should return error if findByUserAndCodeAndNotUsedAndExpired not found a security code valid', async () => {
    const { sut, userRepository, securityCodeRepository } = makeSut()
    const findByIdSpy = jest.spyOn(userRepository, 'findById')
    const findByUserAndCodeAndNotUsedAndExpiredSpy = jest.spyOn(securityCodeRepository, 'findByUserAndCodeAndNotUsedAndExpired').mockResolvedValueOnce(null)
    const data = makeData()
    const error = new Error('Esse código de segurança é inválido ou já expirou!')
    const result = await sut.update(data)
    expect(findByIdSpy).toHaveBeenCalledWith(1)
    expect(findByUserAndCodeAndNotUsedAndExpiredSpy).toHaveBeenCalledWith(data.idUser, data.code)
    expect(result).toStrictEqual(error)
  })

  test('should update password by security code', async () => {
    const { sut, userRepository, securityCodeRepository, hasher } = makeSut()
    const findByIdSpy = jest.spyOn(userRepository, 'findById')
    const findByUserAndCodeAndNotUsedAndExpiredSpy = jest.spyOn(securityCodeRepository, 'findByUserAndCodeAndNotUsedAndExpired')
    const securityCodeUpdateSpy = jest.spyOn(securityCodeRepository, 'update')
    const hashSpy = jest.spyOn(hasher, 'hash')
    const userUpdateSpy = jest.spyOn(userRepository, 'update')
    const data = makeData()
    await sut.update(data)
    expect(findByIdSpy).toHaveBeenCalledWith(1)
    expect(findByUserAndCodeAndNotUsedAndExpiredSpy).toHaveBeenCalledWith(data.idUser, data.code)
    expect(securityCodeUpdateSpy).toHaveBeenCalledWith({ ...securityCodeMock, used: true, usedAt: Date.now() })
    expect(hashSpy).toHaveBeenCalledWith(data.passwordNew)
    expect(userUpdateSpy).toHaveBeenCalledWith({ ...userMock, password: 'stringHash' })
  })

  test('should throw if findById throws', async () => {
    const { sut, userRepository } = makeSut()
    jest.spyOn(userRepository, 'findById').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if findByUserAndCodeAndNotUsedAndExpired throws', async () => {
    const { sut, securityCodeRepository } = makeSut()
    jest.spyOn(securityCodeRepository, 'findByUserAndCodeAndNotUsedAndExpired').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if security code update throws', async () => {
    const { sut, securityCodeRepository } = makeSut()
    jest.spyOn(securityCodeRepository, 'update').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if hash throws', async () => {
    const { sut, hasher } = makeSut()
    jest.spyOn(hasher, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if user update throws', async () => {
    const { sut, userRepository } = makeSut()
    jest.spyOn(userRepository, 'update').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })
})

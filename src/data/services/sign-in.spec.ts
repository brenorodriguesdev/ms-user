import { type SignInModel } from '../../domain/models/sign-in'
import { userMock } from '../../test/mocks/user'
import { EncrypterStub } from '../../test/stubs/encrypter'
import { HasherComparerStub } from '../../test/stubs/hasher-comparer'
import { UserRepositoryStub } from '../../test/stubs/user-repository'
import { type Encrypter } from '../contracts/encrypter'
import { type HasherComparer } from '../contracts/hasher-comparer'
import { type UserRepository } from '../contracts/user-repository'
import { SignInService } from './sign-in'

interface SutTypes {
  encrypter: Encrypter
  hasherComparer: HasherComparer
  userRepository: UserRepository
  sut: SignInService
}

const makeSut = (): SutTypes => {
  const encrypter = new EncrypterStub()
  const hasherComparer = new HasherComparerStub()
  const userRepository = new UserRepositoryStub()
  const sut = new SignInService(userRepository, hasherComparer, encrypter)
  return {
    encrypter,
    hasherComparer,
    userRepository,
    sut
  }
}

const makeData = (): SignInModel => ({
  email: 'example@example.com',
  password: 'password'
})

describe('SignInService', () => {
  test('should return error if not found e-mail', async () => {
    const { sut, userRepository } = makeSut()
    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null)
    const data = makeData()
    const error = new Error('Usuário ou senha inválido!')
    const result = await sut.sign(data)
    expect(findByEmailSpy).toHaveBeenCalledWith(data.email)
    expect(result).toStrictEqual(error)
  })

  test('should return error if compare is invalid', async () => {
    const { sut, userRepository, hasherComparer } = makeSut()
    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail')
    const compareSpy = jest.spyOn(hasherComparer, 'compare').mockResolvedValue(false)
    const data = makeData()
    const error = new Error('Usuário ou senha inválido!')
    const result = await sut.sign(data)
    expect(findByEmailSpy).toHaveBeenCalledWith(data.email)
    expect(compareSpy).toHaveBeenCalledWith(data.password, userMock.password)
    expect(result).toStrictEqual(error)
  })

  test('should return sign in result', async () => {
    const { sut, userRepository, hasherComparer, encrypter } = makeSut()
    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail')
    const compareSpy = jest.spyOn(hasherComparer, 'compare')
    const encryptSpy = jest.spyOn(encrypter, 'encrypt')
    const data = makeData()
    const signInResult = {
      token: 'token',
      name: userMock.name,
      permissions: userMock.profile.permissions
    }
    const result = await sut.sign(data)
    expect(findByEmailSpy).toHaveBeenCalledWith(data.email)
    expect(compareSpy).toHaveBeenCalledWith(data.password, userMock.password)
    expect(encryptSpy).toHaveBeenCalledWith(userMock)
    expect(result).toStrictEqual(signInResult)
  })

  test('should throw if findByEmail throws', async () => {
    const { sut, userRepository } = makeSut()
    jest.spyOn(userRepository, 'findByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.sign(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if compare throws', async () => {
    const { sut, hasherComparer } = makeSut()
    jest.spyOn(hasherComparer, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.sign(makeData())
    await expect(promise).rejects.toThrow()
  })
})

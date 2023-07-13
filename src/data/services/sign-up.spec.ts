import { type SignUpModel } from '../../domain/models/sign-up'
import { HasherStub } from '../../test/stubs/hasher'
import { UserRepositoryStub } from '../../test/stubs/user-repository'
import { type Hasher } from '../contracts/hasher'
import { type UserRepository } from '../contracts/user-repository'
import { SignUpService } from './sign-up'

interface SutTypes {
  userRepository: UserRepository
  hasher: Hasher
  sut: SignUpService
}

const makeSut = (): SutTypes => {
  const userRepository = new UserRepositoryStub()
  const hasher = new HasherStub()
  const sut = new SignUpService(userRepository, hasher)
  return {
    userRepository,
    hasher,
    sut
  }
}

const makeData = (): SignUpModel => ({
  email: 'example@example.com',
  name: 'example',
  password: 'password'
})

describe('SignUpService', () => {
  test('should return error if findByEmail returns a user', async () => {
    const { sut, userRepository } = makeSut()
    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail')
    const data = makeData()
    const error = new Error('Esse e-mail já está em uso!')
    const result = await sut.sign(data)
    expect(findByEmailSpy).toHaveBeenCalledWith(data.email)
    expect(result).toStrictEqual(error)
  })

  test('should create user', async () => {
    const { sut, userRepository, hasher } = makeSut()
    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null)
    const hashSpy = jest.spyOn(hasher, 'hash')
    const createSpy = jest.spyOn(userRepository, 'create')
    const data = makeData()
    await sut.sign(data)
    expect(findByEmailSpy).toHaveBeenCalledWith(data.email)
    expect(hashSpy).toHaveBeenCalledWith(data.password)
    expect(createSpy).toHaveBeenCalledWith({
      email: data.email,
      name: data.name,
      password: 'stringHash'
    })
  })

  test('should throw if findByEmail throws', async () => {
    const { sut, userRepository } = makeSut()
    jest.spyOn(userRepository, 'findByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.sign(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if hash throws', async () => {
    const { sut, userRepository, hasher } = makeSut()
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null)
    jest.spyOn(hasher, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.sign(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if create throws', async () => {
    const { sut, userRepository } = makeSut()
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null)
    jest.spyOn(userRepository, 'create').mockRejectedValueOnce(new Error())
    const promise = sut.sign(makeData())
    await expect(promise).rejects.toThrow()
  })
})

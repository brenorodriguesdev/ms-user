import { type UpdatePasswordModel } from '../../domain/models/update-password'
import { userMock } from '../../test/mocks/user'
import { HasherStub } from '../../test/stubs/hasher'
import { HasherComparerStub } from '../../test/stubs/hasher-comparer'
import { UserRepositoryStub } from '../../test/stubs/user-repository'
import { type Hasher } from '../contracts/hasher'
import { type HasherComparer } from '../contracts/hasher-comparer'
import { type UserRepository } from '../contracts/user-repository'
import { UpdatePasswordService } from './update-password'

interface SutTypes {
  userRepository: UserRepository
  hasherComparer: HasherComparer
  hasher: Hasher
  sut: UpdatePasswordService
}

const makeSut = (): SutTypes => {
  const hasher = new HasherStub()
  const hasherComparer = new HasherComparerStub()
  const userRepository = new UserRepositoryStub()
  const sut = new UpdatePasswordService(userRepository, hasherComparer, hasher)
  return {
    hasher,
    hasherComparer,
    userRepository,
    sut
  }
}
const makeData = (): UpdatePasswordModel => ({
  idUser: 1,
  passwordOld: 'passwordOld',
  passwordNew: 'passwordNew'
})

describe('UpdatePasswordService', () => {
  test('should return error if findById not found a user', async () => {
    const { sut, userRepository } = makeSut()
    const findByIdSpy = jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null)
    const data = makeData()
    const error = new Error('Esse usuário não existe!')
    const result = await sut.update(data)
    expect(findByIdSpy).toHaveBeenCalledWith(1)
    expect(result).toStrictEqual(error)
  })

  test('should return error if compare is invalid', async () => {
    const { sut, userRepository, hasherComparer } = makeSut()
    const findByIdSpy = jest.spyOn(userRepository, 'findById')
    const compareSpy = jest.spyOn(hasherComparer, 'compare').mockResolvedValue(false)
    const data = makeData()
    const error = new Error('Senha antiga inválida!')
    const result = await sut.update(data)
    expect(findByIdSpy).toHaveBeenCalledWith(1)
    expect(compareSpy).toHaveBeenCalledWith(data.passwordOld, userMock.password)
    expect(result).toStrictEqual(error)
  })

  test('should update pasword', async () => {
    const { sut, userRepository, hasherComparer, hasher } = makeSut()
    const findByIdSpy = jest.spyOn(userRepository, 'findById')
    const compareSpy = jest.spyOn(hasherComparer, 'compare')
    const hashSpy = jest.spyOn(hasher, 'hash')
    const updateSpy = jest.spyOn(userRepository, 'update')
    const user = userMock
    const password = userMock.password
    const data = makeData()
    await sut.update(data)
    expect(findByIdSpy).toHaveBeenCalledWith(1)
    expect(compareSpy).toHaveBeenCalledWith(data.passwordOld, password)
    expect(hashSpy).toHaveBeenCalledWith(data.passwordNew)
    expect(updateSpy).toHaveBeenCalledWith({ ...user, password: 'stringHash' })
  })

  test('should throw if findById throws', async () => {
    const { sut, userRepository } = makeSut()
    jest.spyOn(userRepository, 'findById').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if compare throws', async () => {
    const { sut, hasherComparer } = makeSut()
    jest.spyOn(hasherComparer, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if hash throws', async () => {
    const { sut, hasher } = makeSut()
    jest.spyOn(hasher, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })

  test('should throw if update throws', async () => {
    const { sut, userRepository } = makeSut()
    jest.spyOn(userRepository, 'update').mockRejectedValueOnce(new Error())
    const promise = sut.update(makeData())
    await expect(promise).rejects.toThrow()
  })
})

import { type SignInModel } from '../../domain/models/sign-in'
import { type SignInUseCase } from '../../domain/use-cases/sign-in'
import { signInResultMock } from '../../test/mocks/sign-in-result'
import { SignInUseCaseStub } from '../../test/stubs/sign-in'
import { ValidatorStub } from '../../test/stubs/validator'
import { type Validator } from '../../validation/contracts/validator'
import { type HttpRequest } from '../contracts/http'
import { badRequest, ok, serverError, unauthorized } from '../contracts/http-helper'
import { SignInController } from './sign-in'

interface SutTypes {
  validator: Validator<SignInModel>
  signInUseCase: SignInUseCase
  sut: SignInController
}

const makeSut = (): SutTypes => {
  const validator = new ValidatorStub()
  const signInUseCase = new SignInUseCaseStub()
  const sut = new SignInController(validator, signInUseCase)
  return {
    validator,
    signInUseCase,
    sut
  }
}

const makeData = (): HttpRequest<SignInModel> => ({
  body: {
    email: 'example@example.com',
    password: 'password'
  }
})

describe('SignInController', () => {
  test('should return badRequest if validate returned error', async () => {
    const { sut, validator } = makeSut()
    const error = new Error()
    const validateSpy = jest.spyOn(validator, 'validate').mockReturnValueOnce(error)
    const data = makeData()
    const result = await sut.handle(data)
    expect(validateSpy).toHaveBeenCalledWith(data.body)
    expect(result).toStrictEqual(badRequest(error))
  })

  test('should return serverError if validate threw error', async () => {
    const { sut, validator } = makeSut()
    const error = new Error()
    const validateSpy = jest.spyOn(validator, 'validate').mockImplementationOnce(() => { throw error })
    const data = makeData()
    const result = await sut.handle(data)
    expect(validateSpy).toHaveBeenCalledWith(data.body)
    expect(result).toStrictEqual(serverError())
  })

  test('should return serverError if sign threw error', async () => {
    const { sut, validator, signInUseCase } = makeSut()
    const error = new Error()
    const validateSpy = jest.spyOn(validator, 'validate')
    const signSpy = jest.spyOn(signInUseCase, 'sign').mockImplementationOnce(() => { throw error })
    const data = makeData()
    const result = await sut.handle(data)
    expect(validateSpy).toHaveBeenCalledWith(data.body)
    expect(signSpy).toHaveBeenCalledWith(data.body)
    expect(result).toStrictEqual(serverError())
  })

  test('should return unauthorized if sign returned error', async () => {
    const { sut, validator, signInUseCase } = makeSut()
    const error = new Error()
    const data = makeData()
    const validateSpy = jest.spyOn(validator, 'validate')
    const signSpy = jest.spyOn(signInUseCase, 'sign').mockResolvedValueOnce(error)
    const result = await sut.handle(data)
    expect(validateSpy).toHaveBeenCalledWith(data.body)
    expect(signSpy).toHaveBeenCalledWith(data.body)
    expect(result).toStrictEqual(unauthorized(error))
  })

  test('should return ok if sign returned signInResult', async () => {
    const { sut, validator, signInUseCase } = makeSut()
    const data = makeData()
    const validateSpy = jest.spyOn(validator, 'validate')
    const signSpy = jest.spyOn(signInUseCase, 'sign')
    const result = await sut.handle(data)
    expect(validateSpy).toHaveBeenCalledWith(data.body)
    expect(signSpy).toHaveBeenCalledWith(data.body)
    expect(result).toStrictEqual(ok(signInResultMock))
  })
})

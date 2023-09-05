import { type SignInModel } from '../../domain/models/sign-in'
import { type SignInUseCase } from '../../domain/use-cases/sign-in'
import { SignInUseCaseStub } from '../../test/stubs/sign-in'
import { ValidatorStub } from '../../test/stubs/validator'
import { type Validator } from '../../validation/contracts/validator'
import { type HttpRequest } from '../contracts/http'
import { badRequest } from '../contracts/http-helper'
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
  test('should return badRequest if validate return error', async () => {
    const { sut, validator } = makeSut()
    const error = new Error()
    const validateSpy = jest.spyOn(validator, 'validate').mockReturnValueOnce(error)
    const data = makeData()
    const result = await sut.handle(data)
    expect(validateSpy).toHaveBeenCalledWith(data.body)
    expect(result).toStrictEqual(badRequest(error))
  })
})

import { type SignInModel, type SignInResultModel } from '../../domain/models/sign-in'
import { type SignInUseCase } from '../../domain/use-cases/sign-in'
import { type Validator } from '../../validation/contracts/validator'
import { type Controller } from '../contracts/controller'
import { type HttpRequest, type HttpResponse } from '../contracts/http'
import { badRequest, ok, serverError, unauthorized } from '../contracts/http-helper'

export class SignInController implements Controller<SignInModel, SignInResultModel | Error> {
  constructor (
    private readonly validator: Validator<SignInModel>,
    private readonly signInUseCase: SignInUseCase
  ) {}

  async handle (httpRequest: HttpRequest<SignInModel>): Promise<HttpResponse<SignInResultModel | Error>> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const signInResult = await this.signInUseCase.sign(httpRequest.body)
      if (signInResult instanceof Error) {
        return unauthorized(signInResult)
      }
      return ok(signInResult)
    } catch (error) {
      return serverError()
    }
  }
}

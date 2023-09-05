import { type SignInResultModel } from '../../domain/models/sign-in'
import { type SignInUseCase } from '../../domain/use-cases/sign-in'
import { signInResultMock } from '../mocks/sign-in-result'

export class SignInUseCaseStub implements SignInUseCase {
  async sign (): Promise<SignInResultModel> {
    return signInResultMock
  }
}

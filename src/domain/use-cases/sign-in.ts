import { type SignInResultModel, type SignInModel } from '../models/sign-in'

export interface SignInUseCase {
  sign: (data: SignInModel) => Promise<SignInResultModel | Error>
}

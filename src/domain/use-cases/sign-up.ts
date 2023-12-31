import { type SignUpModel } from '../models/sign-up'

export interface SignUpUseCase {
  sign: (data: SignUpModel) => Promise<void | Error>
}

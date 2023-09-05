import { type SignInResultModel } from '../../domain/models/sign-in'

export const signInResultMock: SignInResultModel = ({
  name: 'Administrator',
  permissions: ['ALL'],
  token: 'any_token'
})

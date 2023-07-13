export interface SignInModel {
  email: string
  password: string
}

export interface SignInResultModel {
  name: string
  permissions: string[]
  token: string
}

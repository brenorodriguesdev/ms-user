export interface UpdatePasswordBySecurityCodeModel {
  idUser: number
  code: string
  passwordNew: string
}

import { type UpdatePasswordBySecurityCodeModel } from '../models/update-password-by-security-code'

export interface UpdatePasswordBySecurityCodeUseCase {
  update: (data: UpdatePasswordBySecurityCodeModel) => Promise<void | Error>
}

import { type RecoverPasswordModel } from '../models/recover-password'

export interface RecoverPasswordUseCase {
  recover: (data: RecoverPasswordModel) => Promise<void | Error>
}

import { type UpdatePasswordModel } from '../models/update-password'

export interface UpdatePasswordUseCase {
  update: (data: UpdatePasswordModel) => Promise<void | Error>
}

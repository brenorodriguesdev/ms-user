import { MissingParamError } from '../errors/missing-param-error'
import { type Validator } from '../contracts/validator'

export class RequiredFieldValidator implements Validator<any> {
  constructor (private readonly field: string) {}

  validate (data: any): Error {
    if (!data[this.field]) {
      return new MissingParamError(this.field)
    }
  }
}

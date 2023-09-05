import { type Validator } from '../../validation/contracts/validator'

export class ValidatorStub implements Validator<any> {
  validate (): Error {
    return null
  }
}

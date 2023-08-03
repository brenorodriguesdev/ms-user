export interface Validator<T> {
  validate: (data: T) => Error
}

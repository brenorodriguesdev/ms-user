import { ServerError } from '../errors/server-error'
import { type HttpResponse } from './http'

export const serverError = (): HttpResponse<Error> => ({
  data: new ServerError(),
  statusCode: 500
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  data: error,
  statusCode: 400
})

export const unauthorized = (error: Error): HttpResponse<Error> => ({
  data: error,
  statusCode: 401
})

export const ok = (data: any): HttpResponse<any> => ({
  data,
  statusCode: 200
})

export const created = (): HttpResponse<void> => ({
  data: null,
  statusCode: 201
})

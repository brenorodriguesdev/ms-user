import { type HttpRequest, type HttpResponse } from './http'

export interface Controller<Request, Response> {
  handle: (httpRequest: HttpRequest<Request>) => Promise<HttpResponse<Response>>
}

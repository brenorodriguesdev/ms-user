import { type UserEntity } from '../entities/user'

export const makeBodyRecoverEmail = (user: UserEntity, code: string): string =>
`Olá ${user.name}, acesse o link https://www.teste.com/changePassword?userId=${user.id}&code=${code} para alterar sua senha.`

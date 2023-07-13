import { type Hasher } from '../../data/contracts/hasher'

export class HasherStub implements Hasher {
  async hash (): Promise<string> {
    return 'stringHash'
  }
}

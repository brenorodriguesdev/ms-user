import { type HasherComparer } from '../../data/contracts/hasher-comparer'

export class HasherComparerStub implements HasherComparer {
  async compare (): Promise<boolean> {
    return true
  }
}

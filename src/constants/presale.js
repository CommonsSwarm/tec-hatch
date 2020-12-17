// presale is idle and pending to be started
const PENDING = 'PENDING'
// presale has started and contributors can purchase tokens
const FUNDING = 'FUNDING'
// presale has not reach goal within period and contributors can claim refunds
const REFUNDING = 'REFUNDING'
// presale has reached goal within period and trading is ready to be open
const GOALREACHED = 'GOALREACHED'
// presale has reached goal within period, has been closed and trading has been open
const CLOSED = 'CLOSED'

export const Presale = {
  state: {
    PENDING,
    FUNDING,
    REFUNDING,
    GOALREACHED,
    CLOSED,
  },
  intState: {
    0: PENDING,
    1: FUNDING,
    2: REFUNDING,
    3: GOALREACHED,
    4: CLOSED,
  },
}

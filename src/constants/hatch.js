// hatch is idle and pending to be started
const PENDING = 'PENDING'
// hatch has started and contributors can purchase tokens
const FUNDING = 'FUNDING'
// hatch has not reach goal within period and contributors can claim refunds
const REFUNDING = 'REFUNDING'
// hatch has reached goal within period and trading is ready to be open
const GOALREACHED = 'GOALREACHED'
// hatch has reached goal within period, has been closed and trading has been open
const CLOSED = 'CLOSED'

export const Hatch = {
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

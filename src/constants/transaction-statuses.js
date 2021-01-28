// Transaction statuses
const TX_SIGNING = Symbol('TX_SIGNING')
const TX_MINING = Symbol('TX_MINING')
const TX_SUCCESS = Symbol('TX_SUCCESS')
const TX_ERROR = Symbol('TX_ERROR')

// Pretransaction statuses
const PRE_TX_FETCHING = Symbol('TX_FETCHING')
const PRE_TX_PROCESSING = Symbol('PRE_TX_PROCESSING')
const PRE_TX_FINISHED = Symbol('PRE_TX_FINISHED')

const stringStatuses = {
  [TX_SIGNING]: 'TX_SIGNING',
  [TX_MINING]: 'TX_MINING',
  [TX_SUCCESS]: 'TX_SUCCESS',
  [TX_ERROR]: 'TX_ERROR',
  [PRE_TX_FETCHING]: 'PRE_TX_FETCHING',
  [PRE_TX_PROCESSING]: 'PRE_TX_PROCESSING',
  [PRE_TX_FINISHED]: 'PRE_TX_FINISHED',
}

export const TxStatuses = {
  TX_SIGNING,
  TX_MINING,
  TX_SUCCESS,
  TX_ERROR,
  PRE_TX_FETCHING,
  PRE_TX_PROCESSING,
  PRE_TX_FINISHED,
}

export const statusToString = status => stringStatuses[status]

import { TxStatuses } from './transaction-statuses'

const {
  TX_FETCHING,
  TX_SIGNING,
  TX_MINING,
  TX_SUCCESS,
  TX_ERROR,
  PRE_TX_FINISHED,
} = TxStatuses

export const TX_DESCRIPTIONS = {
  [TX_FETCHING]: 'Loading...',
  [TX_SIGNING]: 'Signing...',
  [TX_MINING]: 'Pending...',
  [TX_SUCCESS]: 'Confirmed',
  [TX_ERROR]: 'Transaction failed',
  [PRE_TX_FINISHED]: 'Waiting for signature',
}

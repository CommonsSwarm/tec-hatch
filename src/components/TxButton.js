import React from 'react'
import styled from 'styled-components'
import { Button, GU, LoadingRing } from '@commonsswarm/ui'

import { TX_DESCRIPTIONS, TxStatuses } from '../constants'

const {
  TX_PREPARING,
  PRE_TX_FETCHING,
  PRE_TX_PROCESSING,
  PRE_TX_FINISHED,
} = TxStatuses

const TxButton = ({
  txsData = {},
  label,
  mode = 'normal',
  type = 'submit',
  disabled = false,
  wide = true,
  onClick = () => {},
}) => {
  const { txStatus, preTxStatus, txCounter, txCurrentIndex } = txsData

  return (
    <Button
      mode={mode}
      type={type}
      disabled={disabled || !!preTxStatus || !!txStatus}
      wide={wide}
      onClick={onClick}
    >
      {preTxStatus || txStatus ? (
        <PreparingTxWrapper>
          <LoadingRing
            css={`
              margin-right: ${0.5 * GU}px;
            `}
          />{' '}
          {txStatus === TX_PREPARING && TX_DESCRIPTIONS[txStatus]}
          {preTxStatus === PRE_TX_FETCHING && TX_DESCRIPTIONS[txStatus]}
          {preTxStatus === PRE_TX_PROCESSING &&
            `Pretransactions (${txCurrentIndex} of ${txCounter - 1}): ${
              TX_DESCRIPTIONS[txStatus]
            }`}
          {preTxStatus === PRE_TX_FINISHED && label}
        </PreparingTxWrapper>
      ) : (
        label
      )}
    </Button>
  )
}

const PreparingTxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default TxButton

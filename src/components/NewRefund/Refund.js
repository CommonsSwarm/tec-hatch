import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Info, GU, LoadingRing, DropDown } from '@tecommons/ui'
import Information from './Information'
import { formatBigNumber } from '../../utils/bn-utils'
import { useWallet } from '../../providers/Wallet'
import useActions from '../../hooks/useActions'
import { useAppState } from '../../providers/AppState'
import { useContributionsSubscription } from '../../hooks/useSubscriptions'
import { TxStatuses } from '../../constants'

const { PRE_TX_FINISHED, TX_ERROR, TX_MINING } = TxStatuses

const Refund = () => {
  const { account } = useWallet()
  const { refund, txsData } = useActions()
  const {
    config: {
      hatchConfig: {
        contributionToken: { symbol, decimals },
      },
    },
    refundPanel: { requestClose },
  } = useAppState()
  const { txStatus, preTxStatus } = txsData
  const contributions = useContributionsSubscription({
    contributor: account,
    orderBy: 'value',
    orderDirection: 'desc',
  })
  const [selectedContribution, setSelectedContribution] = useState(-1)

  const transformedContributions = contributions
    ? contributions.map(
        c =>
          `${formatBigNumber(c.value, decimals)} ${symbol} made on ${new Date(
            c.createdAt
          ).toLocaleDateString()}`
      )
    : []
  const contribution =
    selectedContribution > -1 ? contributions[selectedContribution] : null

  const handleRefund = ({ vestedPurchaseId } = {}) => {
    if (account) {
      refund(account, vestedPurchaseId)
    }
  }
  useEffect(() => {
    if (
      txStatus === TX_ERROR ||
      (preTxStatus === PRE_TX_FINISHED && txStatus === TX_MINING)
    ) {
      requestClose()
    }
    return () => {}
  }, [preTxStatus, txStatus, requestClose])

  return (
    <div
      css={`
        margin: ${4 * GU}px 0;
      `}
    >
      {account && contributions?.length > 0 ? (
        <div>
          <div
            css={`
              margin-bottom: ${2 * GU}px;
            `}
          >
            <DropDown
              placeholder="Select a contribution"
              items={transformedContributions}
              selected={selectedContribution}
              onChange={setSelectedContribution}
              wide
            />
          </div>
          <Button
            mode="strong"
            wide
            onClick={() => handleRefund(contribution)}
            disabled={!!preTxStatus || selectedContribution < 0}
          >
            {preTxStatus ? (
              <PreparingTxWrapper>
                <LoadingRing /> Refund
              </PreparingTxWrapper>
            ) : (
              <span>Refund</span>
            )}
          </Button>
          <Information />
        </div>
      ) : (
        <Info>You don't have any contribution to refund.</Info>
      )}
    </div>
  )
}

const PreparingTxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default Refund

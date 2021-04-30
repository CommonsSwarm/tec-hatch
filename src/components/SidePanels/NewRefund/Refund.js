import React, { useState } from 'react'
import { Info, GU, DropDown } from '@commonsswarm/ui'
import Information from './Information'
import TxButton from '../../TxButton'

import { formatBigNumber } from '../../../utils/bn-utils'
import { useWallet } from '../../../providers/Wallet'
import useActions from '../../../hooks/useActions'
import { useAppState } from '../../../providers/AppState'
import { useContributionsSubscription } from '../../../hooks/useSubscriptions'

const Refund = () => {
  const { account } = useWallet()
  const {
    config: {
      hatchConfig: {
        contributionToken: { symbol, decimals },
      },
    },
    refundPanel: { requestClose },
  } = useAppState()
  const { refund } = useActions(requestClose)
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

  const handleSubmit = event => {
    const { vestedPurchaseId } = contribution

    event.preventDefault()
    if (account) {
      refund(account, vestedPurchaseId)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
            <TxButton
              account={account}
              disabled={selectedContribution < 0}
              label={`Refund ${symbol} Tokens`}
            />
            <Information />
          </div>
        ) : (
          <Info>You don't have any contribution to refund.</Info>
        )}
      </div>
    </form>
  )
}

export default Refund

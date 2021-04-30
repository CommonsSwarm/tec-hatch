import React from 'react'
import BigNumber from 'bignumber.js'
import { Box, Distribution, LoadingRing } from '@commonsswarm/ui'
import TokenField from './TokenField'

import { useAppState } from '../providers/AppState'

const calculatePercentage = (amount, total) => {
  if (amount.eq(0) && total.eq(0)) {
    return 0
  }

  const percentage = amount
    .div(total)
    .multipliedBy(100)
    .toNumber()

  /**
   * Distribution component receives percentages
   * as numbers
   */
  return Number(percentage.toFixed(2))
}

const MyContributions = ({ user }) => {
  const {
    config: {
      hatchConfig: { token, contributionToken },
    },
  } = useAppState()
  const { contributorData, awardedTokenAmount, loading } = user
  const { totalValue, totalAmount } = contributorData || {}
  const distributionColors = ['#5DADE2', '#F7DC6F']
  let totalTokens = new BigNumber(0)
  let mintedTokensPct = new BigNumber(0)
  let awardedTokensPct = new BigNumber(0)

  if (!loading) {
    totalTokens = totalAmount.plus(awardedTokenAmount)
    mintedTokensPct = calculatePercentage(totalAmount, totalTokens)
    awardedTokensPct = calculatePercentage(awardedTokenAmount, totalTokens)
  }

  return (
    <Box heading="My Contributions">
      {loading ? (
        <div
          css={`
            display: flex;
            justify-content: center;
          `}
        >
          <LoadingRing mode="half-circle" />
        </div>
      ) : (
        <>
          <TokenField
            label="Contributions"
            amount={totalValue}
            token={contributionToken}
          />
          <Distribution
            colors={distributionColors}
            heading={
              <TokenField label="Tokens" amount={totalTokens} token={token} />
            }
            items={[
              { item: 'Acquired', percentage: mintedTokensPct },
              { item: 'IH Rewarded', percentage: awardedTokensPct },
            ]}
          />
        </>
      )}
    </Box>
  )
}

export default MyContributions

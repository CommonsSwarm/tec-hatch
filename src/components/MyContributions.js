import React from 'react'
import BigNumber from 'bignumber.js'
import { Box, Distribution, GU, LoadingRing, textStyle } from '@tecommons/ui'
import { useAppState } from '../providers/AppState'
import { formatBigNumber } from '../utils/bn-utils'

const calculatePercentage = (amount, total) => {
  if (amount.eq(0) && total.eq(0)) {
    return 0
  }
  const percentage = amount.div(total).multipliedBy(100)

  return Number(Number(percentage.toString()).toFixed(2))
}

const MyContributions = ({ user }) => {
  const {
    config: {
      hatchConfig: {
        token: { symbol, decimals },
      },
    },
  } = useAppState()
  const { contributorData, awardedTokenAmount, loading } = user
  const { formattedTotalValue, totalAmount } = contributorData || {}
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
            font-size: 30px;
          `}
        >
          <LoadingRing mode="half-circle" />
        </div>
      ) : (
        <>
          <ContributionItem title="Contributions" value={formattedTotalValue} />
          <Distribution
            colors={distributionColors}
            heading={
              <ContributionItem
                title="Tokens"
                value={`${formatBigNumber(totalTokens, decimals)} ${symbol}`}
              />
            }
            items={[
              { item: 'Minted', percentage: mintedTokensPct },
              { item: 'Rewarded', percentage: awardedTokensPct },
            ]}
          />
        </>
      )}
    </Box>
  )
}

const ContributionItem = ({ title, value }) => {
  return (
    <div
      css={`
        display: flex;
        justify-content: space-between;
        margin-bottom: ${0.5 * GU}px;
      `}
    >
      <div
        css={`
          ${textStyle('body1')}
        `}
      >
        <strong>{title}</strong>
      </div>
      <div
        css={`
          text-align: right;
        `}
      >
        {value}
      </div>
    </div>
  )
}

export default MyContributions

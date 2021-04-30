import React from 'react'
import { Box, Button, CircleGraph, useTheme, GU } from '@commonsswarm/ui'
import { Hatch } from '../constants'
import { formatBigNumber } from '../utils/bn-utils'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

export default React.memo(() => {
  const theme = useTheme()
  const { account } = useWallet()
  const {
    config: {
      hatchConfig: {
        contributionToken: { symbol: collateralSymbol, decimals },
        token: { symbol: tokenSymbol },
        minGoal,
        totalRaised,
        state,
      },
    },
    contributionPanel: { requestOpen: requestContributionOpen },
    refundPanel: { requestOpen: requestRefundOpen },
    redeemPanel: { requestOpen: requestRedeemOpen },
  } = useAppState()

  return (
    <Box heading="Fundraising Goal">
      <div className="circle">
        <CircleGraph
          value={totalRaised.div(minGoal).toNumber()}
          size={20.5 * GU}
        />
        <p
          title={`${formatBigNumber(
            totalRaised,
            decimals
          )} ${collateralSymbol} of ${formatBigNumber(
            minGoal,
            decimals
          )} ${collateralSymbol}`}
          css={`
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: ${theme.surfaceContentSecondary};
            margin-bottom: ${2 * GU}px;
          `}
        >
          <span
            css={`
              color: ${theme.surfaceContent};
            `}
          >
            {formatBigNumber(totalRaised, decimals)}
          </span>{' '}
          {collateralSymbol} of{' '}
          <span
            css={`
              color: ${theme.surfaceContent};
            `}
          >
            {formatBigNumber(minGoal, decimals)}
          </span>{' '}
          {collateralSymbol}
        </p>
        {state === Hatch.state.FUNDING && (
          <>
            <Button
              mode="normal"
              label={`Mint ${tokenSymbol}`}
              onClick={requestContributionOpen}
              disabled={!account}
            />
          </>
        )}
        {state === Hatch.state.GOALREACHED && (
          <>
            <p
              css={`
                white-space: nowrap;
                color: ${theme.surfaceContent};
              `}
            >
              <strong>Hatch goal completed! 🎉</strong>
            </p>
          </>
        )}
        {state === Hatch.state.REFUNDING && (
          <>
            <p>
              Unfortunately, the goal set for this hatch has not been reached.
            </p>
            <Button
              wide
              label="Refund Hatch Tokens"
              css={`
                margin-top: ${2 * GU}px;
              `}
              onClick={requestRefundOpen}
            />
          </>
        )}
        {state === Hatch.state.CLOSED && (
          <Button
            wide
            label="Redeem Tokens"
            disabled={!account}
            onClick={requestRedeemOpen}
          />
        )}
      </div>
    </Box>
  )
})

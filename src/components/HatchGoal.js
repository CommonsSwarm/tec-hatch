import React from 'react'
import styled from 'styled-components'
import { Box, Button, useTheme, GU } from '@commonsswarm/ui'
import { Hatch } from '../constants'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import CircleGraphGoals from './CircleGraphGoals'
import TokenField from './TokenField'

export default React.memo(() => {
  const theme = useTheme()
  const { account } = useWallet()
  const {
    config: {
      hatchConfig: {
        contributionToken,
        token: { symbol: tokenSymbol },
        minGoal,
        targetGoal,
        maxGoal,
        totalRaised,
        state,
      },
    },
    contributionPanel: { requestOpen: requestContributionOpen },
    refundPanel: { requestOpen: requestRefundOpen },
    redeemPanel: { requestOpen: requestRedeemOpen },
  } = useAppState()

  return (
    <Box heading="Hatch Goal">
      <Wrapper>
        <CircleGraphGoals
          totalRaised={totalRaised}
          minGoal={minGoal}
          targetGoal={targetGoal}
          maxGoal={maxGoal}
          token={contributionToken}
        />
        <div
          css={`
            width: 100%;
            border: 1px solid;
            color: ${theme.surfaceUnder};
          `}
        />
        <TokenField
          label="Total Raised"
          token={contributionToken}
          amount={totalRaised}
        />
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: ${3 * GU}px;
          `}
        >
          {state === Hatch.state.FUNDING && (
            <>
              <Button
                wide
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
                label={`Refund ${tokenSymbol}`}
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
              label={`Redeem ${tokenSymbol}`}
              disabled={!account}
              onClick={requestRedeemOpen}
            />
          )}
        </div>
      </Wrapper>
    </Box>
  )
})

const Wrapper = styled.div`
  & > div {
    margin-bottom: ${2 * GU}px;
  }
`

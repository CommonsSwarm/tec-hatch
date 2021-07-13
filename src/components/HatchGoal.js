import React from 'react'
import styled from 'styled-components'
import { Box, Button, useTheme, GU, Info } from '@commonsswarm/ui'
import { Hatch } from '../constants'
import { useAppState } from '../providers/AppState'

import CircleGraphGoals from './CircleGraphGoals'
import TokenField from './TokenField'
import { useUserState } from '../providers/UserState'
import TermsAgreement from './TermsAgreement'

export default React.memo(() => {
  const theme = useTheme()
  const { account, contributorData, loading: userLoading } = useUserState()
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
              <TermsAgreement />
            </>
          )}
          {state === Hatch.state.GOALREACHED && (
            <>
              <Message>
                <strong>Hatch goal completed! 🎉</strong>
              </Message>
            </>
          )}
          {state === Hatch.state.REFUNDING && (
            <>
              <Message>Hatch goal hasn&#39;t been reached</Message>
              {!userLoading && !!contributorData && (
                <Info
                  css={`
                    margin-top: ${GU}px;
                  `}
                >
                  All your {contributionToken.symbol} tokens{' '}
                  {contributorData.totalAmount.eq(0)
                    ? 'were refunded successfully'
                    : 'will be refunded shortly'}
                  .
                </Info>
              )}
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

const Message = styled.div`
  white-space: nowrap;
  color: ${({ theme }) => theme.surfaceContent};
  font-weight: bold;
`

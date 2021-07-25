import React from 'react'
import { Box, LoadingRing } from '@commonsswarm/ui'
import TokenField from './TokenField'

import { useAppState } from '../providers/AppState'

const MyContributions = React.memo(({ user }) => {
  const {
    config: {
      hatchConfig: { token, contributionToken },
    },
  } = useAppState()
  const { contributorData, loading: userLoading } = user
  const { totalValue, totalAmount } = contributorData || {}

  return (
    <Box heading="My Contributions">
      {userLoading ? (
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
          <TokenField label="Tokens" amount={totalAmount} token={token} />
        </>
      )}
    </Box>
  )
})

export default MyContributions

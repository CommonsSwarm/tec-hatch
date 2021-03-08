import React, { useContext } from 'react'
import { Box, Button, CircleGraph, useTheme, GU } from '@tecommons/ui'
// import CircleGraph from '../components/CircleGraph'
import { HatchViewContext } from '../context'
import { Hatch } from '../constants'
import { formatBigNumber } from '../utils/bn-utils'
import { useAppState } from '../providers/AppState'

export default React.memo(() => {
  const theme = useTheme()
  const {
    config: {
      hatchConfig: {
        contributionToken: { symbol, decimals },
        minGoal,
        totalRaised,
        state,
      },
    },
  } = useAppState()
  const { setRefundPanel, setHatchPanel } = useContext(HatchViewContext)
  // *****************************
  // misc
  // *****************************
  // const circleColor = {
  //   [Hatch.state.PENDING]: color('#ecedf1'),
  //   [Hatch.state.FUNDING]: theme.accent,
  //   [Hatch.state.GOALREACHED]: theme.positive,
  //   [Hatch.state.REFUNDING]: theme.negative,
  //   [Hatch.state.CLOSED]: color('#21c1e7'),
  // }

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
          )} ${symbol} of ${formatBigNumber(minGoal, decimals)} ${symbol}`}
          css={`
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          <span
            css={`
              color: ${theme.surfaceContent};
            `}
          >
            {formatBigNumber(totalRaised, decimals)}
          </span>{' '}
          {symbol} of{' '}
          <span
            css={`
              color: ${theme.surfaceContent};
            `}
          >
            {formatBigNumber(minGoal, decimals)}
          </span>{' '}
          {symbol}
        </p>
        {state === Hatch.state.FUNDING && (
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            <Button
              mode="normal"
              label="Buy hatch shares"
              onClick={() => setHatchPanel(true)}
            />
          </div>
        )}
        {state === Hatch.state.GOALREACHED && (
          <>
            <p
              css={`
                white-space: nowrap;
                margin-top: ${2 * GU}px;
                color: ${theme.surfaceContent};
              `}
            >
              <strong>Hatch goal completed! 🎉</strong>
            </p>
          </>
        )}
        {state === Hatch.state.REFUNDING && (
          <>
            <p
              css={`
                margin-top: ${2 * GU}px;
              `}
            >
              Unfortunately, the goal set for this hatch has not been reached.
            </p>
            <Button
              wide
              mode="strong"
              label="Refund Hatch Tokens"
              css={`
                margin-top: ${2 * GU}px;
                width: 100%;
              `}
              onClick={() => setRefundPanel(true)}
            >
              Refund hatch shares
            </Button>
          </>
        )}
      </div>
    </Box>
  )
})

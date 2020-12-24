import React, { useContext } from 'react'
import { Box, Button, CircleGraph, useTheme, GU, color } from '@tecommons/ui'
// import CircleGraph from '../components/CircleGraph'
import { PresaleViewContext } from '../context'
import { Presale } from '../constants'
import { formatBigNumber } from '../utils/bn-utils'
import { useWallet } from '../providers/Wallet'
import useActions from '../hooks/useActions'
import { useAppState } from '../providers/AppState'

export default React.memo(() => {
  const theme = useTheme()
  const { account } = useWallet()
  const { closePresale } = useActions()
  const {
    config: {
      contributionToken: { symbol, decimals },
      minGoal,
      totalRaised,
      state,
    },
  } = useAppState()
  const { setRefundPanel, setPresalePanel } = useContext(PresaleViewContext)
  // *****************************
  // misc
  // *****************************
  const circleColor = {
    [Presale.state.PENDING]: color('#ecedf1'),
    [Presale.state.FUNDING]: theme.accent,
    [Presale.state.GOALREACHED]: theme.positive,
    [Presale.state.REFUNDING]: theme.negative,
    [Presale.state.CLOSED]: color('#21c1e7'),
  }

  /**
   * Calls the `presale.close` smart contarct function on button click
   * @param {Object} event - the event to prevent
   * @returns {void}
   */
  const handleOpenTrading = event => {
    event.preventDefault()
    if (account) {
      closePresale().catch(console.error)
    }
  }

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
        {state === Presale.state.FUNDING && (
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            <Button
              mode="normal"
              label="Buy hatch shares"
              onClick={() => setPresalePanel(true)}
            />
          </div>
        )}
        {state === Presale.state.GOALREACHED && (
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
        {state === Presale.state.REFUNDING && (
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

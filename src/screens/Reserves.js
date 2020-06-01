import React, { useCallback, useState } from 'react'
import { useAppState } from '@aragon/api-react'
import { Box, GU, Help, IdentityBadge, Split, textStyle, TokenBadge, useLayout, useTheme } from '@aragon/ui'
import DefinitionsBox from '../components/DefinitionsBox'
import UpdateFees from '../components/Fees/UpdateFees'
import Fees from '../components/Fees/Fees'
import { formatBigNumber, percentageFromBase } from '../utils/bn-utils'

// In this copy we should display the user the percentage of max increase of the tap
const helpContent = tokenSymbol => {
  return [
    [
      'What is the collateralization ratio?',
      'The collateralization ratio defines the ratio between the amount of collateral in your market-maker reserve and the market cap of this marketplace.',
    ],
  ]
}

const ReserveSetting = ({ label, helpContent: [hint, help], value }) => {
  const theme = useTheme()
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        margin-bottom: ${3 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <span
          css={`
            margin-right: ${1 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          {label}
        </span>
        <Help hint={hint}>{help}</Help>
      </div>
      <p
        css={`
          ${textStyle('body1')};
          font-weight: 600;
        `}
      >
        {value}
      </p>
    </div>
  )
}

export default () => {
  // *****************************
  // background script state
  // *****************************
  const {
    constants: { PPM, PCT_BASE },
    values: { buyFeePct, sellFeePct },
    collaterals: {
      primaryCollateral: { reserveRatio: primaryCollateralReserveRatio, symbol: primaryCollateralSymbol },
    },
    bondedToken: { name, symbol, decimals: tokenDecimals, address, realSupply },
  } = useAppState()

  // *****************************
  // internal state
  // *****************************

  const theme = useTheme()
  const { layoutName } = useLayout()

  const [panelOpened, setPanelOpened] = useState(false)

  const handlePanelOpen = useCallback(() => {
    setPanelOpened(true)
  }, [])
  const handlePanelClose = useCallback(() => {
    setPanelOpened(false)
  }, [])

  // *****************************
  // human readable values
  // *****************************
  const adjustedTokenSupply = formatBigNumber(realSupply, tokenDecimals)
  const primaryCollateralRatio = formatBigNumber(primaryCollateralReserveRatio.div(PPM).times(100), 0)

  const adjustedBuyFeePct = percentageFromBase(buyFeePct, PCT_BASE)
  const adjustedSellFee = percentageFromBase(sellFeePct, PCT_BASE)

  return (
    <>
      <div
        css={`
          display: grid;
          grid-template-columns: auto 1fr 1fr;
          grid-gap: ${2 * GU}px;
        `}
      >
        <Box heading="Collateralization ratios">
          <div
            css={`
              display: grid;
              grid-column-gap: ${3 * GU}px;
              grid-template-columns: repeat(${layoutName === 'small' ? '1' : '2'}, 1fr);
              width: 100%;
            `}
          >
            {[[primaryCollateralSymbol, primaryCollateralRatio]].map(([symbol, ratio], i) => (
              <ReserveSetting
                key={i}
                label={`${symbol} collateralization ratio`}
                helpContent={helpContent(primaryCollateralSymbol)[0]}
                value={
                  <span>
                    {ratio}
                    <span
                      css={`
                        margin-left: ${0.5 * GU}px;
                        color: ${theme.surfaceContentSecondary};
                      `}
                    >
                      %
                    </span>
                  </span>
                }
              />
            ))}
          </div>
        </Box>

        <div>
          <DefinitionsBox
            heading="Shares"
            definitions={[
              { label: 'Total Supply', content: <strong>{adjustedTokenSupply}</strong> },
              {
                label: 'Token',
                content: <TokenBadge name={name} symbol={symbol} badgeOnly />,
              },
              { label: 'Address', content: <IdentityBadge entity={address} /> },
            ]}
          />
        </div>
        <Fees onRequestUpdateFees={handlePanelOpen} buyFeePct={adjustedBuyFeePct} sellFeePct={adjustedSellFee} />
      </div>
      <UpdateFees opened={panelOpened} onClosePanel={handlePanelClose} buyFeePct={adjustedBuyFeePct} sellFeePct={adjustedSellFee} />
    </>
  )
}

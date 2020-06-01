import React, { useContext } from 'react'
import styled from 'styled-components'
import { useAppState } from '@aragon/api-react'
import { Box, useTheme, GU } from '@aragon/ui'
import BigNumber from 'bignumber.js'
import Chart from '../components/Chart'
import { formatBigNumber } from '../utils/bn-utils'
import { MainViewContext } from '../context'

export default () => {
  // *****************************
  // background script state
  // *****************************
  const {
    bondedToken: { decimals: tokenDecimals, realSupply },
    collaterals: {
      primaryCollateral: { address: primaryCollateralAddress, decimals: primaryCollateralDecimals, symbol: primaryCollateralSymbol },
    },
    orders,
  } = useAppState()

  const theme = useTheme()

  // *****************************
  // context state
  // *****************************
  const { reserveBalance, price } = useContext(MainViewContext)

  // *****************************
  // human readable values
  // *****************************
  // numbers
  const numberSuffix = ' ' + primaryCollateralSymbol
  const adjustedPrice = price ? formatBigNumber(price, 0, { numberSuffix }) : '...'
  const marketCap = price ? price.times(realSupply) : null
  const adjustedMarketCap = price && marketCap ? formatBigNumber(marketCap, primaryCollateralDecimals, { numberSuffix }) : '...'
  const tradingVolume = orders
    // only keep primary collateral orders
    .filter(o => o.collateral === primaryCollateralAddress)
    // keep values
    .map(o => o.value)
    // sum them and tada, you got the trading volume
    .reduce((acc, current) => acc.plus(current), new BigNumber(0))
  const adjustedTradingVolume = formatBigNumber(tradingVolume, primaryCollateralDecimals, { numberSuffix })
  const adjustedTokenSupply = formatBigNumber(realSupply, tokenDecimals)
  const realReserve = reserveBalance
  const adjustedReserves = realReserve ? formatBigNumber(realReserve, primaryCollateralDecimals, { numberSuffix }) : '...'

  return (
    <div>
      <KeyMetrics
        heading={
          <span
            css={`
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            `}
          >
            Key Metrics
          </span>
        }
        padding={0}
        theme={theme}
      >
        <ul>
          <li>
            <div>
              <p className="title">Price</p>
              <p className="number">{adjustedPrice}</p>
            </div>
          </li>
          <li>
            <div>
              <p className="title">Market Cap</p>
              <p className="number">{adjustedMarketCap}</p>
            </div>
          </li>
          <li>
            <div>
              <p className="title">Trading Volume</p>
              <p className="number">{adjustedTradingVolume}</p>
            </div>
          </li>
          <li>
            <div>
              <p className="title">Share Supply</p>
              <p className="number">{adjustedTokenSupply}</p>
            </div>
          </li>
          <li>
            <div>
              <p className="title">Reserves</p>
              <p className="number">{adjustedReserves}</p>
            </div>
          </li>
        </ul>
      </KeyMetrics>
      <Chart />
    </div>
  )
}

const KeyMetrics = styled(Box)`
  margin-bottom: ${2 * GU}px;

  .green {
    color: ${props => props.theme.positive};
  }

  .red {
    color: ${props => props.theme.negative};
  }

  .none {
    visibility: hidden;
  }

  .title {
    margin-bottom: ${2 * GU}px;
    font-weight: 600;
  }

  ul {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    border-radius: 3px;
    padding: ${2 * GU}px;
  }

  li {
    list-style-type: none;

    img {
      display: inline-block;
      height: 16px;
      margin-right: ${1 * GU}px;
    }

    .title {
      display: flex;
      font-size: 16px;
      font-weight: 300;
      color: ${props => props.theme.content};
      white-space: nowrap;
      margin-bottom: ${1.5 * GU}px;
    }

    .number {
      margin-bottom: ${2 * GU}px;
      font-size: 21px;
      line-height: 24px;
    }

    .sub-number {
      font-size: 16px;
      span {
        font-weight: 300;
        color: ${props => props.theme.contentSecondary};
      }
    }
  }

  @media only screen and (max-width: 1152px) {
    ul {
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${2 * GU}px;
      border-bottom: 1px solid ${props => props.theme.border};

      div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .title {
        margin: 0;
      }

      .number {
        margin-bottom: 0;
      }
    }

    li:last-child {
      border-bottom: none;
    }
  }
`

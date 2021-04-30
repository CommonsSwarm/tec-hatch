import React from 'react'
import { GU, textStyle, useTheme } from '@commonsswarm/ui'
import { formatBigNumber } from '../utils/bn-utils'

const TokenField = ({ label, amount, token }) => {
  const theme = useTheme()
  const { decimals, symbol } = token

  return (
    <div
      css={`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: ${0.5 * GU}px;
      `}
    >
      <div
        css={`
          width: 100%;
          color: ${theme.surfaceContent.alpha(0.7)};
          ${textStyle('body2')}
        `}
      >
        <strong>{label}</strong>
      </div>
      <div
        css={`
          text-align: right;
          width: 75%;
          font-weight: bold;
          ${textStyle('body2')}
        `}
      >
        {`${formatBigNumber(amount, decimals)} ${symbol}`}
      </div>
    </div>
  )
}

export default TokenField

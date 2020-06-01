import React from 'react'
import { Box, Button, GU, IconEdit, textStyle, useTheme } from '@aragon/ui'

const Fees = ({ buyFeePct, sellFeePct, onRequestUpdateFees }) => {
  return (
    <Box heading="Fees">
      <div>
        <Field label="Buy fee" value={`${buyFeePct} %`} />
        <Field label="Sell fee" value={`${sellFeePct} %`} />
        <Button
          css={`
            margin-top: ${2 * GU}px;
          `}
          icon={<IconEdit />}
          label="Update Fees"
          onClick={onRequestUpdateFees}
          wide
        />
      </div>
    </Box>
  )
}

const Field = ({ label, value }) => {
  const theme = useTheme()

  return (
    <div
      css={`
        margin-bottom: ${2 * GU}px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `}
    >
      <h2
        css={`
          color: ${theme.surfaceContentSecondary};
        `}
      >
        {label}
      </h2>

      <div
        css={`
          ${textStyle('body2')};
        `}
      >
        {value}
      </div>
    </div>
  )
}

export default Fees

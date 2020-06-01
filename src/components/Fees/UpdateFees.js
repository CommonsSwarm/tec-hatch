import React, { useCallback, useState } from 'react'
import { Button, Field, GU, Info, SidePanel, TextInput, useTheme } from '@aragon/ui'
import { useAragonApi } from '@aragon/api-react'
import { percetangeToBase } from '../../utils/bn-utils'

const UpdateFees = ({ buyFeePct: initialBuyFeePct, opened, onClosePanel, sellFeePct: initialSellFeePct }) => {
  const { api, appState } = useAragonApi()
  const {
    constants: { PCT_BASE },
  } = appState

  const [buyFeePct, setBuyFeePct] = useState(initialBuyFeePct)
  const [sellFeePct, setSellFeePct] = useState(initialSellFeePct)

  const handleBuyFeeChange = useCallback(event => {
    const newBuyFeePct = event.target.value
    setBuyFeePct(Math.min(Math.max(newBuyFeePct, 0), 100))
  }, [])

  const handleSellFeeChange = useCallback(event => {
    const newSellFeePct = event.target.value
    setSellFeePct(Math.min(Math.max(newSellFeePct, 0), 100))
  }, [])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      const convertedBuyFees = percetangeToBase(buyFeePct, PCT_BASE)
      const convertedSellFees = percetangeToBase(sellFeePct, PCT_BASE)

      api.updateFees(convertedBuyFees.toString(), convertedSellFees.toString()).toPromise()
      onClosePanel()
    },
    [api, buyFeePct, onClosePanel, PCT_BASE, sellFeePct]
  )

  const feesUpdated = buyFeePct !== initialBuyFeePct || sellFeePct !== initialSellFeePct

  return (
    <SidePanel opened={opened} onClose={onClosePanel} title="Update Fees">
      <form
        noValidate
        onSubmit={handleSubmit}
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        <Info
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          title="Action"
        >
          Update the fee taken from all buy/sell orders that is deposited into the organisation's funding pool
        </Info>
        <Field label="Buy fee">
          <PercentageInput value={buyFeePct} onChange={handleBuyFeeChange} />
        </Field>
        <Field label="Sell fee">
          <PercentageInput value={sellFeePct} onChange={handleSellFeeChange} />
        </Field>

        <Button
          label="Update Fees"
          mode="strong"
          type="submit"
          wide
          disabled={!feesUpdated}
          css={`
            margin-top: ${2 * GU}px;
          `}
        />
      </form>
    </SidePanel>
  )
}

const PercentageInput = ({ value, onChange }) => {
  const theme = useTheme()
  const adornmentSettings = { padding: 1 }

  return (
    <TextInput
      type="number"
      value={value}
      onChange={onChange}
      wide
      required
      min={0}
      max={100}
      adornment={
        <span
          css={`
            background: ${theme.background};
            border-left: 1px solid ${theme.border};
            padding: 7px ${2 * GU}px;
          `}
        >
          %
        </span>
      }
      adornmentPosition="end"
      adornmentSettings={adornmentSettings}
    />
  )
}

export default UpdateFees

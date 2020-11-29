import React, { useEffect, useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, Text, TextInput, theme, unselectable, GU } from '@aragon/ui'
import { PresaleViewContext } from '../../context'
import Total from './Total'
import Info from './Info'
import ValidationError from '../ValidationError'
import { toDecimals, formatBigNumber } from '../../utils/bn-utils'
import { useAppLogic } from '../../hooks/useAppLogic'
import { useWallet } from '../../providers/Wallet'
import BigNumber from 'bignumber.js'

export default () => {
  const { account } = useWallet()

  const {
    actions: { contribute, getCollateralAllowance, approveCollateralAllowance },
    config: {
      id: hatchAddress,
      contributionToken: {
        symbol: contributionSymbol,
        decimals: contributionDecimals,
      },
    },
  } = useAppLogic()
  const {
    presalePanel,
    setPresalePanel,
    userPrimaryCollateralBalance,
  } = useContext(PresaleViewContext)
  const [value, setValue] = useState('')
  const [valid, setValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const valueInput = useRef(null)

  // handle reset when opening
  useEffect(() => {
    if (presalePanel) {
      // reset to default values
      setValue('')
      setValid(false)
      setErrorMessage(null)

      // Focus the right input after some time to avoid the panel transition to
      // be skipped by the browser.
      valueInput && setTimeout(() => valueInput.current.focus(), 100)
    }
  }, [presalePanel])

  const handleValueUpdate = event => {
    setValue(event.target.value)
  }

  const validate = (err, message) => {
    setValid(err)
    setErrorMessage(message)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (account) {
      const amount = toDecimals(value, contributionDecimals).toFixed()
      const allowance = await getCollateralAllowance(account, hatchAddress)
      // Check if we had enough token allowance to make the contribution
      if (allowance.lt(new BigNumber(value))) {
        // If we had some allowance we set it back to zero before approving the contribution amount
        if (!allowance.isZero()) {
          await approveCollateralAllowance(hatchAddress, 0)
        }

        await approveCollateralAllowance(hatchAddress, amount)
      }
      contribute(account, amount).catch(console.error)
    }
    setPresalePanel(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputsWrapper>
        <p
          css={`
            margin: ${2 * GU}px 0;
          `}
        >
          Your balance:{' '}
          {formatBigNumber(userPrimaryCollateralBalance, contributionDecimals)}{' '}
          {contributionSymbol}
        </p>
        <ValueField key="collateral">
          <label>
            <StyledTextBlock>{contributionSymbol} TO SPEND</StyledTextBlock>
          </label>
          <TextInput
            ref={valueInput}
            type="number"
            value={value}
            onChange={handleValueUpdate}
            min={0}
            placeholder="0"
            step="any"
            required
            wide
          />
        </ValueField>
      </InputsWrapper>
      <Total value={value} onError={validate} />
      <ButtonWrapper>
        <Button mode="strong" type="submit" disabled={!valid || !account} wide>
          Buy hatch shares
        </Button>
      </ButtonWrapper>
      {errorMessage && <ValidationError messages={[errorMessage]} />}
      <Info />
    </form>
  )
}

const ButtonWrapper = styled.div`
  padding-top: 10px;
`

const ValueField = styled.div`
  margin-bottom: 20px;
`

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledTextBlock = styled(Text.Block).attrs({
  color: theme.textSecondary,
  smallcaps: true,
})`
  ${unselectable()};
  display: flex;
`

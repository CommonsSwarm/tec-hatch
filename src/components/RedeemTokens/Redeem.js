import React, { useCallback, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

import {
  Text,
  TextInput,
  Button,
  Slider,
  breakpoint,
  Field,
} from '@tecommons/ui'
// import RedeemTokenList from '../RedeemTokenList'
import { InfoMessage } from './Message'

import { fromDecimals, toDecimals } from '../../utils/bn-utils'
import { safeDiv, round } from '../../utils/math-utils'
import { useUserState } from '../../providers/UserState'
import { useAppState } from '../../providers/AppState'
import useActions from '../../hooks/useActions'

const MAX_INPUT_DECIMAL_BASE = 6

// HELPERS
// function getTokenExchange(tokens, amount, totalSupply) {
//   return tokens.map(t => safeDiv(amount * t.amount, totalSupply))
// }

const RedeemTokens = ({ totalSupply = 1000, tokens }) => {
  const {
    config: {
      hatchConfig: { token, contributionToken },
    },
    redeemPanel: { visible: panelOpened },
  } = useAppState()
  const { symbol, decimals } = token
  const { symbol: cTokenSymbol } = contributionToken
  const { contributorData } = useUserState()
  const { redeem } = useActions()
  const { totalAmount } = contributorData || {}
  // Get metrics
  const rounding = Math.min(MAX_INPUT_DECIMAL_BASE, decimals)
  const minTokenStep = fromDecimals(
    '1',
    Math.min(MAX_INPUT_DECIMAL_BASE, decimals)
  )

  // Format BN
  const formattedBalance = fromDecimals(totalAmount, decimals).toString()
  // const formattedSupply = toDecimals(totalSupply, decimals).toString()
  const formattedSupply = '1000'

  // Use state
  const [{ value, max, progress }, setAmount, setProgress] = useAmount(
    formattedBalance.replace(',', ''),
    rounding
  )

  // Focus input
  const inputRef = useRef(null)
  useEffect(() => {
    if (panelOpened) {
      inputRef.current.focus()
    }
  }, [panelOpened])

  const handleFormSubmit = event => {
    event.preventDefault()

    redeem(toDecimals(value, decimals).toFixed())
  }

  // Filter tokens with 0 balance and get exchange
  // const tokensWithBalance = tokens ? tokens.filter(t => !t.amount.isZero()) : []
  // const youGet = getTokenExchange(
  //   tokensWithBalance,
  //   value,
  //   totalSupply / Math.pow(10, decimals)
  // )

  return (
    <div
      css={`
        margin-top: 1rem;
      `}
    >
      <form onSubmit={handleFormSubmit}>
        <InfoMessage
          title="Redemption action"
          text={`This action will burn ${value} ${symbol} tokens in exchange for ${cTokenSymbol} tokens`}
        />
        <TokenInfo>
          You have{' '}
          <Text weight="bold">
            {formattedBalance} out of a total of {formattedSupply} {symbol}{' '}
          </Text>{' '}
          tokens for redemption
        </TokenInfo>
        <Wrapper>
          <SliderWrapper label="Amount to burn">
            <Slider value={progress} onUpdate={setProgress} />
          </SliderWrapper>
          <InputWrapper>
            <TextInput
              type="number"
              name="amount"
              wide={false}
              value={value}
              max={max}
              min="0"
              step={minTokenStep}
              onChange={setAmount}
              required
              ref={inputRef}
            />
            <Text size="large">{symbol}</Text>
          </InputWrapper>
        </Wrapper>
        {/* {tokensWithBalance.length > 0 ? (
          <RedeemTokenList tokens={tokensWithBalance} youGet={youGet} />
        ) : (
          <Info>No eligible assets in the vault</Info>
        )} */}
        <Button mode="strong" wide type="submit" disabled={value <= 0}>
          Redeem Tokens
        </Button>
      </form>
    </div>
  )
}

// CUSTOM HOOK
const useAmount = (balance, rounding) => {
  const [amount, setAmount] = useState({
    value: balance,
    max: balance,
    progress: 1,
  })

  // If balance or rounding (unlikely) changes => Update max balance && Update amount based on progress
  useEffect(() => {
    setAmount(prevState => {
      // Recalculate value based on same progress and new balance
      const newValue = round(prevState.progress * balance, rounding)

      return { ...prevState, value: String(newValue), max: balance }
    })
  }, [balance, rounding])

  // Change amount handler
  const handleAmountChange = useCallback(
    event => {
      const newValue = Math.min(event.target.value, balance)
      const newProgress = safeDiv(newValue, balance)

      setAmount(prevState => ({
        ...prevState,
        value: String(newValue),
        progress: newProgress,
      }))
    },
    [balance]
  )

  // Change progress handler
  const handleSliderChange = useCallback(
    newProgress => {
      // Round amount to 2 decimals when changing slider
      // Check for edge case where setting max amount with more than 2 decimals
      const newValue =
        newProgress === 1
          ? round(balance, rounding)
          : round(newProgress * balance, 2)

      setAmount(prevState => ({
        ...prevState,
        value: String(newValue),
        progress: newProgress,
      }))
    },
    [balance, rounding]
  )

  return [amount, handleAmountChange, handleSliderChange]
}

export default RedeemTokens

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 0px;
`

const SliderWrapper = styled(Field)`
  flex-basis: 50%;
  > :first-child > :nth-child(2) {
    min-width: 150px;
    padding-left: 0;
    ${breakpoint(
      'medium',
      `
     min-width: 200px;
   `
    )}
  }
`
const InputWrapper = styled.div`
  flex-basis: 50%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  > :first-child {
    width: 75%;
  }
`

// const Info = styled.div`
//   padding: 20px;
//   margin-bottom: 20px;
//   text-align: center;
// `

const TokenInfo = styled.div`
  padding: 20px 0;
`

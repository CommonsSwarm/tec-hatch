import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  TextInput,
  Slider,
  breakpoint,
  Field,
  useSidePanelFocusOnReady,
  textStyle,
} from '@tecommons/ui'
import { InfoMessage } from './Message'

import {
  formatBigNumber,
  fromDecimals,
  toDecimals,
} from '../../../utils/bn-utils'
import { safeDiv, round } from '../../../utils/math-utils'
import { useUserState } from '../../../providers/UserState'
import { useAppState } from '../../../providers/AppState'
import useActions from '../../../hooks/useActions'
import TxButton from '../../TxButton'
import BigNumber from 'bignumber.js'
import { useInterval } from '../../../hooks/useInterval'
import { Polling } from '../../../constants'

const MAX_INPUT_DECIMAL_BASE = 2

const RedeemTokens = () => {
  const inputRef = useSidePanelFocusOnReady()
  const {
    config: {
      hatchConfig: { token, contributionToken },
    },
    redeemPanel: { requestClose },
  } = useAppState()
  const { symbol, decimals } = token
  const {
    symbol: contributionSymbol,
    decimals: contributionDecimals,
  } = contributionToken
  const { contributorData } = useUserState()
  const {
    redeem,
    getTokenTotalSupply,
    getReserveTokenBalance,
    txsData,
  } = useActions(requestClose)
  const { totalAmount } = contributorData || {}

  // Get metrics
  const rounding = Math.min(MAX_INPUT_DECIMAL_BASE, decimals)
  const minTokenStep = fromDecimals('1', rounding)

  const formattedBalance = formatBigNumber(totalAmount, decimals)
  // Use state
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0))
  const [reserveTokenBalance, setReserveTokenBalance] = useState(
    new BigNumber(0)
  )
  const [{ value, max, progress }, setAmount, setProgress] = useAmount(
    formattedBalance.replace(',', ''),
    rounding
  )

  const decimalValue = toDecimals(value, decimals)
  const exchangeValue = decimalValue.times(reserveTokenBalance.div(totalSupply))

  const fetchRedeemTokenData = useCallback(
    (token, contributionToken) =>
      Promise.all([
        getTokenTotalSupply(token),
        getReserveTokenBalance(contributionToken),
      ]),

    [getTokenTotalSupply, getReserveTokenBalance]
  )

  useEffect(() => {
    const setUpRedeemTokenData = async () => {
      if (!token || !contributionToken) {
        return
      }

      const [
        newTotalSupply,
        newReserveTokenBalance,
      ] = await fetchRedeemTokenData(token, contributionToken)

      setTotalSupply(newTotalSupply)
      setReserveTokenBalance(newReserveTokenBalance)
    }

    setUpRedeemTokenData()
  }, [token, contributionToken, fetchRedeemTokenData])

  useInterval(async () => {
    if (!token || !contributionToken) {
      return
    }

    try {
      const [
        newTotalSupply,
        newReserveTokenBalance,
      ] = await fetchRedeemTokenData(token, contributionToken)

      if (!newTotalSupply.eq(totalSupply)) {
        setTotalSupply(newTotalSupply)
      }
      if (!newReserveTokenBalance.eq(reserveTokenBalance)) {
        setReserveTokenBalance(reserveTokenBalance)
      }
    } catch (err) {
      console.error(`Error fetching redeem token data: ${err}`)
    }
  }, Polling.DURATION)

  const handleSubmit = event => {
    event.preventDefault()

    redeem(decimalValue.toFixed())
  }

  return (
    <div
      css={`
        margin-top: 1rem;
      `}
    >
      <form onSubmit={handleSubmit}>
        <InfoMessage
          title="Redemption action"
          text={`This action will burn ${formatBigNumber(
            decimalValue,
            decimals
          )} ${symbol} tokens in exchange for ${contributionSymbol} tokens`}
        />
        <TokenInfo>
          You have{' '}
          <span
            css={`
              font-weight: bold;
            `}
          >
            {formattedBalance} {symbol}{' '}
          </span>{' '}
          tokens for redemption
        </TokenInfo>
        <div
          css={`
            margin-bottom: 20px;
            padding: 20px 0px;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
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
              <div
                css={`
                  ${textStyle('body2')}
                `}
              >
                {symbol}
              </div>
            </InputWrapper>
          </div>
          <div
            css={`
              display: flex;
              justify-content: flex-end;
            `}
          >
            {exchangeValue && (
              <>
                <AmountField color="grey">
                  ~{formatBigNumber(exchangeValue, contributionDecimals)}
                </AmountField>
                <span
                  css={`
                    color: grey;
                  `}
                >
                  {contributionSymbol}
                </span>
              </>
            )}
          </div>
        </div>
        <TxButton
          txsData={txsData}
          disabled={value <= 0}
          label={`Redeem ${symbol} Tokens`}
        />
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
      const newValue = round(Math.min(event.target.value, balance), rounding)
      const newProgress = safeDiv(newValue, balance)

      setAmount(prevState => ({
        ...prevState,
        value: String(newValue),
        progress: newProgress,
      }))
    },
    [balance, rounding]
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
const AmountField = styled.div`
  margin-right: 10px;
  color: grey;
`
const TokenInfo = styled.div`
  padding: 20px 0;
`

export default RedeemTokens

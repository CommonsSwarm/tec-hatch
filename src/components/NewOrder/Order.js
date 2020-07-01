import ethers from 'ethers'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useApi, useAppState, useConnectedAccount, useCurrentApp } from '@aragon/api-react'
import { Button, DropDown, GU, Info, Text, TextInput, theme, unselectable, useTheme } from '@aragon/ui'
import { MainViewContext } from '../../context'
import Total from './Total'
import Info_ from './Info'
import ValidationError from '../ValidationError'
import { toDecimals, formatBigNumber } from '../../utils/bn-utils'
import miniMeTokenAbi from '../../abi/MiniMeToken.json'
import marketMakerAbi from '../../abi/BancorMarketMaker.json'

const Order = ({ isBuyOrder }) => {
  // *****************************
  // background script state
  // *****************************
  const {
    constants: { PCT_BASE },
    values: { buyFeePct, sellFeePct },
    addresses: { marketMaker },
    collaterals,
    bondedToken: { decimals: bondedDecimals, symbol: bondedSymbol },
  } = useAppState()
  const collateralItems = useMemo(() => [collaterals.primaryCollateral], [collaterals])
  const connectedUser = useConnectedAccount()
  const currentApp = useCurrentApp()

  // *****************************
  // aragon api
  // *****************************
  const api = useApi()

  // *****************************
  // context state
  // *****************************
  const { orderPanel, setOrderPanel, userBondedTokenBalance, userPrimaryCollateralBalance } = useContext(MainViewContext)

  // *****************************
  // internal state
  // *****************************
  const [selectedCollateral, setSelectedCollateral] = useState(0)
  const [amount, setAmount] = useState('')
  const [slippagePercent, setSlippagePercent] = useState(1)
  const [minReturnAmount, setMinReturnAmount] = useState('')
  const [feeAmount, setFeeAmount] = useState(0)
  const [valid, setValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const amountInput = useRef(null)

  // *****************************
  // effects
  // *****************************
  // handle reset when opening
  useEffect(() => {
    if (orderPanel) {
      // reset to default values
      setSelectedCollateral(0)
      setAmount('')
      setValid(false)
      setErrorMessage(null)
      // focus the right input, given the order type
      // timeout to avoid some flicker
      amountInput.current && setTimeout(() => amountInput.current.focus(), 100)
    }
  }, [orderPanel, isBuyOrder])

  // *****************************
  // handlers
  // *****************************
  const handleAmountUpdate = useCallback(event => {
    setAmount(event.target.value)
  }, [])

  const handleSlippageUpdated = useCallback(event => {
    const value = event.target.value
    if (value >= 0 && value <= 100) {
      setSlippagePercent(event.target.value)
    }
  }, [])

  const validate = useCallback((err, message) => {
    setValid(err)
    setErrorMessage(message)
  }, [])

  const handleSubmit = event => {
    event.preventDefault()
    const collateralAddress = collateralItems[selectedCollateral].address
    if (valid) {
      const amountBn = toDecimals(amount, isBuyOrder ? collateralItems[selectedCollateral].decimals : bondedDecimals).toFixed()
      const minReturnBn = toDecimals(minReturnAmount, isBuyOrder ? bondedDecimals : collateralItems[selectedCollateral].decimals).toFixed()

      if (isBuyOrder) {
        if (collateralItems[selectedCollateral].isMiniMeToken) {
          const marketMakerInterface = new ethers.utils.Interface(marketMakerAbi)
          const makeBuyOrderData = marketMakerInterface.encodeFunctionData(
            "makeBuyOrder(address,address,uint256,uint256)", [connectedUser, collateralAddress, amountBn, minReturnBn])
          api
            .external(collateralAddress, miniMeTokenAbi)
            .approveAndCall(currentApp.appAddress, amountBn, makeBuyOrderData)
            .toPromise()
        } else {
          const intent = { token: { address: collateralAddress, value: amountBn, spender: marketMaker } }
          api
            .makeBuyOrder(collateralAddress, amountBn, minReturnBn, intent)
            .toPromise()
            .catch(console.error)
        }
      } else {
        api
          .makeSellOrder(collateralAddress, amountBn, minReturnBn)
          .toPromise()
          .catch(console.error)
      }
      setOrderPanel(false)
    }
  }

  const getDecimals = useCallback(() => {
    return isBuyOrder ? collateralItems[selectedCollateral].decimals : bondedDecimals
  }, [bondedDecimals, collateralItems, isBuyOrder, selectedCollateral])

  const getSymbol = useCallback(() => {
    return isBuyOrder ? collateralItems[selectedCollateral].symbol : bondedSymbol
  }, [bondedSymbol, collateralItems, isBuyOrder, selectedCollateral])

  const getConversionSymbol = useCallback(() => {
    return isBuyOrder ? bondedSymbol : collateralItems[selectedCollateral].symbol
  }, [bondedSymbol, collateralItems, isBuyOrder, selectedCollateral])

  const getUserBalance = useCallback(() => {
    const balance = isBuyOrder ? [userPrimaryCollateralBalance][selectedCollateral] : userBondedTokenBalance
    const decimals = isBuyOrder ? collateralItems[selectedCollateral].decimals : bondedDecimals
    return formatBigNumber(balance, decimals)
  }, [bondedDecimals, collateralItems, isBuyOrder, selectedCollateral, userBondedTokenBalance, userPrimaryCollateralBalance])

  const getFeePercentage = useCallback(() => {
    const percentageOf = numberWithDecimals => {
      return numberWithDecimals
        .div(PCT_BASE)
        .times(100)
        .toFixed(2, 1)
    }

    return isBuyOrder ? percentageOf(buyFeePct) : percentageOf(sellFeePct)
  }, [buyFeePct, isBuyOrder, PCT_BASE, sellFeePct])

  const amountData = useMemo(() => {
    const reserveRatio = collateralItems[selectedCollateral].reserveRatio

    return {
      value: amount,
      decimals: getDecimals(),
      symbol: getSymbol(),
      reserveRatio,
      feePercentage: getFeePercentage(),
      slippagePercent,
    }
  }, [amount, collateralItems, getDecimals, getSymbol, getFeePercentage, selectedCollateral, slippagePercent])

  return (
    <form noValidate onSubmit={handleSubmit}>
      <InputsWrapper>
        <AmountField key="collateral">
          <label>
            {isBuyOrder && <StyledTextBlock>{collateralItems[selectedCollateral].symbol} TO SPEND</StyledTextBlock>}
            {!isBuyOrder && <StyledTextBlock>{bondedSymbol} TO SELL</StyledTextBlock>}
          </label>
          <CombinedInput css="margin-bottom: 10px;">
            <TextInput type="number" value={amount} onChange={handleAmountUpdate} min={0} placeholder="0" step="any" required wide />
            {isBuyOrder ? (
              <span
                css={`
                  width: ${2 * GU}px;
                `}
              />
            ) : (
              <Text
                as="span"
                css={`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 0 10px;
                `}
              >
                against
              </Text>
            )}
            <DropDown items={[collaterals.primaryCollateral.symbol]} selected={selectedCollateral} onChange={setSelectedCollateral} css="width: 130px;" />
          </CombinedInput>
          <label>
            <StyledTextBlock>ACCEPTED SLIPPAGE</StyledTextBlock>
          </label>
          <PercentageInput value={slippagePercent} onChange={handleSlippageUpdated} />
        </AmountField>
      </InputsWrapper>
      <Total
        isBuyOrder={isBuyOrder}
        amount={amountData}
        conversionSymbol={getConversionSymbol()}
        onError={validate}
        setMinReturnAmount={setMinReturnAmount}
        setFeeAmount={setFeeAmount}
        feeAmount={feeAmount}
      />
      <div
        css={`
          padding: ${2 * GU}px 0 0;
        `}
      >
        <Button mode="strong" type="submit" disabled={!valid || !slippagePercent} wide>
          Open {isBuyOrder ? 'buy' : 'sell'} order
        </Button>
      </div>
      {errorMessage && <ValidationError messages={[errorMessage]} />}
      <div
        css={`
          padding-top: ${2 * GU}px;
        `}
      >
        <Info
          title={`Your ${isBuyOrder ? '' : 'spendable'} balance`}
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          {getUserBalance()} {getSymbol()}
          {!isBuyOrder &&
            <p css={`padding-top: ${GU}px`}>
              Note that your accounts balance displayed elsewhere may differ if tokens are still vesting.
            </p>}
        </Info>

        <Info_
          isBuyOrder={isBuyOrder}
          slippage={collateralItems[selectedCollateral].slippage}
          minExpectedReturnAmount={minReturnAmount}
          tokenSymbol={isBuyOrder ? bondedSymbol : collateralItems[selectedCollateral].symbol}
        />

        {getFeePercentage() > 0 && (
          <Info
            title={`Fee (${getFeePercentage()}%)`}
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            <p>{`A fee of ${formatBigNumber(feeAmount, 0)} ${
              collateralItems[selectedCollateral].symbol
            } will be sent directly to the organisation's funding pool.`}</p>
          </Info>
        )}
      </div>
    </form>
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
      placeholder="0"
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

const AmountField = styled.div`
  margin-bottom: ${2.5 * GU}px;
`

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const CombinedInput = styled.div`
  display: flex;
  input[type='text'] {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }
  input[type='text'] + div > div:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`

const StyledTextBlock = styled(Text.Block).attrs({
  color: theme.textSecondary,
  smallcaps: true,
})`
  ${unselectable()};
  display: flex;
`

export default Order

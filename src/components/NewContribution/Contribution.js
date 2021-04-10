import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Text,
  TextInput,
  theme,
  unselectable,
  GU,
  LoadingRing,
} from '@tecommons/ui'
import Total from './Total'
import {
  MaxContributionInformation,
  HatchInformation,
  TxInformation,
} from './Information'
import ValidationError from '../ValidationError'
import { toDecimals, formatBigNumber } from '../../utils/bn-utils'
import useActions from '../../hooks/useActions'
import { useAppState } from '../../providers/AppState'
import { TX_DESCRIPTIONS, TxStatuses } from '../../constants'
import BigNumber from 'bignumber.js'
import { useUserState } from '../../providers/UserState'

const {
  PRE_TX_FETCHING,
  PRE_TX_FINISHED,
  PRE_TX_PROCESSING,
  TX_ERROR,
  TX_MINING,
} = TxStatuses

const Contribution = () => {
  const {
    account,
    contributorData,
    collateralBalance,
    allowedContributionAmount,
  } = useUserState()
  const { contribute, txsData } = useActions()
  const { txStatus, preTxStatus, txCounter, txCurrentIndex } = txsData
  const {
    config: {
      hatchConfig: {
        contributionToken: {
          symbol: contributionSymbol,
          decimals: contributionDecimals,
        },
        token: { symbol: tokenSymbol },
      },
      hatchOracleConfig: {
        scoreToken: { symbol: scoreSymbol },
      },
    },
    contributionPanel: { visible, requestClose },
  } = useAppState()
  const [value, setValue] = useState('')
  const [valid, setValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const valueInput = useRef(null)

  // handle reset when opening
  useEffect(() => {
    if (visible) {
      // reset to default values
      setValue('')
      setValid(false)
      setErrorMessage(null)

      // Focus the right input after some time to avoid the panel transition to
      // be skipped by the browser.
      valueInput && setTimeout(() => valueInput.current.focus(), 300)
    }
  }, [visible])

  useEffect(() => {
    if (
      txStatus === TX_ERROR ||
      (preTxStatus === PRE_TX_FINISHED && txStatus === TX_MINING)
    ) {
      requestClose()
    }
    return () => {}
  }, [preTxStatus, txStatus, requestClose])

  useEffect(() => {
    async function checkBalances() {
      const totalContribution = contributorData
        ? contributorData.totalValue
        : new BigNumber(0)
      if (allowedContributionAmount.eq(new BigNumber(0))) {
        if (totalContribution.eq(new BigNumber(0))) {
          validate(
            false,
            `You can't contribute to the hatch because you don't have ${scoreSymbol} tokens.`
          )
        } else {
          validate(
            false,
            `You don't have any allowed contribution amount left.`
          )
        }
      }
    }

    if (account) {
      checkBalances(account)
    }

    return () => {}
  }, [account, contributorData, allowedContributionAmount, scoreSymbol])

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

      await contribute(account, amount)
    }
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
          {formatBigNumber(collateralBalance, contributionDecimals)}{' '}
          {contributionSymbol}
        </p>
        <ValueField key="collateral">
          <label>
            <StyledTextBlock>
              {contributionSymbol} TO SPEND{' '}
              {account && (
                <>
                  (Maximum Allowed{' '}
                  {formatBigNumber(
                    allowedContributionAmount,
                    contributionDecimals
                  )}{' '}
                  {contributionSymbol})
                </>
              )}
            </StyledTextBlock>
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
            disabled={!!preTxStatus}
          />
        </ValueField>
      </InputsWrapper>
      <Total value={value} onError={validate} />
      <ButtonWrapper>
        <Button
          mode="normal"
          type="submit"
          disabled={!valid || !account || !!preTxStatus}
          wide
        >
          {preTxStatus ? (
            <PreparingTxWrapper>
              <LoadingRing
                css={`
                  margin-right: ${0.5 * GU}px;
                `}
              />{' '}
              {preTxStatus === PRE_TX_FETCHING && TX_DESCRIPTIONS[txStatus]}
              {preTxStatus === PRE_TX_PROCESSING &&
                `Pretransactions (${txCurrentIndex} of ${txCounter - 1}): ${
                  TX_DESCRIPTIONS[txStatus]
                }`}
              {preTxStatus === PRE_TX_FINISHED && `Mint ${tokenSymbol} Tokens`}
            </PreparingTxWrapper>
          ) : (
            `Mint ${tokenSymbol} Tokens`
          )}
        </Button>
      </ButtonWrapper>
      {errorMessage && <ValidationError messages={[errorMessage]} />}
      {
        <div>
          <MaxContributionInformation scoreSymbol={scoreSymbol} />
          <HatchInformation />
          <TxInformation />
        </div>
      }
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

const PreparingTxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledTextBlock = styled(Text.Block).attrs({
  color: theme.textSecondary,
  smallcaps: true,
})`
  ${unselectable()};
  display: flex;
`

export default Contribution

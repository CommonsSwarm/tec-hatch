import React from 'react'
import styled from 'styled-components'
import { Info, GU } from '@tecommons/ui'

export const MaxContributionInformation = ({ scoreSymbol = 'score' }) => (
  <BaseInformation>
    <Info>
      <Title>Maximum Contribution Allowed</Title>
      <Paragraph>
        There is a maximum amount you can contribute to the hatch based on your{' '}
        {scoreSymbol} tokens.
      </Paragraph>
    </Info>
  </BaseInformation>
)

export const HatchInformation = () => (
  <BaseInformation>
    <Info.Action>
      If the hatch campaign fails, you can get refunded. If the hatch campaign
      succeeds, your shares will be vested.
    </Info.Action>
  </BaseInformation>
)

export const TxInformation = () => (
  <BaseInformation>
    <Info mode="warning">
      <Title>TWO OR THREE TRANSACTIONS REQUIRED </Title>
      <Paragraph>
        This action requires two or three transactions to be signed in Metamask.
        Please confirm them one after another.{' '}
      </Paragraph>
      <Paragraph>
        In some situations, Metamask may warn you that the second or third
        transaction will fail. Please ignore this warning.
      </Paragraph>
    </Info>
  </BaseInformation>
)

export const ErrorInformation = ({ symbol }) => (
  <BaseInformation>
    <Info mode="error">
      <Title>No Score Token</Title>
      <Paragraph>
        You can&apos;t contribute to the hatch because you don&apos;t have{' '}
        {symbol} tokens.
      </Paragraph>
    </Info>
  </BaseInformation>
)

const BaseInformation = styled.div`
  margin-top: ${4 * GU}px;
`

const Title = styled.div`
  font-weight: bold;
`
const Paragraph = styled.div`
  margin-top: ${1 * GU}px;
`

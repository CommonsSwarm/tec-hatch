import React from 'react'
import styled from 'styled-components'
import { Info, GU } from '@aragon/ui'

const TxInfo = () => {
  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
      `}
    >
      <Info mode="warning">
        <Title>TWO TRANSACTIONS REQUIRED </Title>
        <Paragraph>
          This action requires two transactions to be signed in Metamask. Please
          confirm them one after another.{' '}
        </Paragraph>
        <Paragraph>
          In some situations, Metamask may warn you that the second transaction
          will fail. Please ignore this warning.
        </Paragraph>
      </Info>
    </div>
  )
}

const Title = styled.div`
  font-weight: bold;
`
const Paragraph = styled.div`
  margin-top: ${1 * GU}px;
`
export default TxInfo

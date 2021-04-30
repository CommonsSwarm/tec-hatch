import React from 'react'
import styled from 'styled-components'
import { CircleGraph, GU, textStyle, unselectable } from '@commonsswarm/ui'
import { formatBigNumber } from '../utils/bn-utils'

const CircleGraphGoals = ({
  mainCircleSize = 164,
  secondaryCircleSizes = 90,
  totalRaised,
  minGoal,
  targetGoal,
  maxGoal,
  token,
}) => {
  const targetGoalPct = totalRaised.div(targetGoal).toNumber()
  const minGoalPct = totalRaised.div(minGoal).toNumber()
  const maxGoalPct = totalRaised.div(maxGoal).toNumber()

  return (
    <div>
      <MainCircleWrapper>
        <CircleGraphGoal
          label="target"
          value={targetGoalPct}
          size={mainCircleSize}
          goal={targetGoal}
          token={token}
        />
      </MainCircleWrapper>
      <SecondaryCircleWrapper>
        <CircleGraphGoal
          label="min"
          value={minGoalPct}
          size={secondaryCircleSizes}
          goal={minGoal}
          token={token}
        />
        <CircleGraphGoal
          label="max"
          value={maxGoalPct}
          size={secondaryCircleSizes}
          goal={maxGoal}
          token={token}
        />
      </SecondaryCircleWrapper>
    </div>
  )
}

const CircleGraphGoal = ({
  label = '',
  value,
  goal,
  size,
  token: { decimals, symbol },
}) => (
  <div
    css={`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      ${unselectable}
    `}
  >
    <CircleGraph
      label={() => ({
        secondary: label.toUpperCase(),
      })}
      value={value > 1 ? 1 : value}
      size={size}
      strokeWidth={6}
    />
    <CircleLabel>{`${formatBigNumber(goal, decimals)} ${symbol}`}</CircleLabel>
  </div>
)

const CircleLabel = styled.div`
  margin-top: ${GU}px;
  color: ${({ theme }) => theme.surfaceIcon};
  font-weight: bold;
  ${textStyle('body3')}
`

const MainCircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  margin-bottom: ${0.5 * GU}px;
`
const SecondaryCircleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 -${GU}px;
`

export default CircleGraphGoals

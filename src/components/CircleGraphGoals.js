import React from 'react'
import styled from 'styled-components'
import {
  CircleGraph,
  GU,
  textStyle,
  unselectable,
  useLayout,
} from '@commonsswarm/ui'
import { formatBigNumber } from '../utils/bn-utils'

const MEDIUM_LAYOUT_RATIO = 1.7

const CircleGraphGoals = ({
  mainCircleSize = 164,
  secondaryCircleSizes = 90,
  totalRaised,
  minGoal,
  targetGoal,
  maxGoal,
  token,
}) => {
  const { layoutName } = useLayout()
  const mainSize =
    layoutName === 'medium'
      ? mainCircleSize * MEDIUM_LAYOUT_RATIO
      : mainCircleSize
  const secondarySize =
    layoutName === 'medium'
      ? secondaryCircleSizes * MEDIUM_LAYOUT_RATIO
      : secondaryCircleSizes
  const targetGoalPct = totalRaised.div(targetGoal).toNumber()
  const minGoalPct = totalRaised.div(minGoal).toNumber()
  const maxGoalPct = totalRaised.div(maxGoal).toNumber()

  return (
    <Wrapper>
      <MainCircleWrapper>
        <CircleGraphGoal
          label="target"
          value={targetGoalPct}
          size={mainSize}
          goal={targetGoal}
          token={token}
        />
      </MainCircleWrapper>
      <SecondaryCircleWrapper layout={layoutName}>
        <CircleGraphGoal
          label="min"
          value={minGoalPct}
          size={secondarySize}
          goal={minGoal}
          token={token}
        />
        <CircleGraphGoal
          label="max"
          value={maxGoalPct}
          size={secondarySize}
          goal={maxGoal}
          token={token}
        />
      </SecondaryCircleWrapper>
    </Wrapper>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
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
  width: ${({ layout }) => (layout === 'medium' ? 75 : 100)}%;
  display: flex;
  justify-content: space-between;
  margin: 0 -${GU}px;
`

export default CircleGraphGoals

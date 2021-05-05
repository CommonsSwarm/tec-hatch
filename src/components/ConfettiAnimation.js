import React, { useEffect, useMemo, useState } from 'react'
import Confetti from 'react-confetti'
import {
  GU,
  RootPortal,
  useTheme,
  useViewport,
  useLayout,
} from '@commonsswarm/ui'
import { useTransition, animated } from 'react-spring'
import { useAppState } from '../providers/AppState'

const MINIMUM_CONFETTI_PIECES = 800

function getConfettiConfig(amount, minGoal, targetGoal, maxGoal) {
  if (amount.gte(minGoal) && amount.lt(targetGoal)) {
    return { goalTarget: 'MIN', confettiPieces: MINIMUM_CONFETTI_PIECES }
  } else if (amount.gte(targetGoal) && amount.lt(maxGoal)) {
    return { goalTarget: 'TARGET', confettiPieces: MINIMUM_CONFETTI_PIECES * 2 }
  } else if (amount.eq(maxGoal)) {
    return { goalTarget: 'MAX', confettiPieces: MINIMUM_CONFETTI_PIECES * 4 }
  } else {
    return {}
  }
}

const GoalReachedAnimation = () => {
  const { layoutName } = useLayout()
  const {
    config: {
      hatchConfig: { totalRaised, minGoal, targetGoal, maxGoal },
    },
  } = useAppState()
  const { goalTarget, confettiPieces } = useMemo(
    () => getConfettiConfig(totalRaised, minGoal, targetGoal, maxGoal),
    [totalRaised, minGoal, targetGoal, maxGoal]
  )

  const { width, height } = useViewport()
  const theme = useTheme()

  const [show, setShow] = useState(false)

  const screenTransitions = useTransition(show, null, {
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    enter: {
      opacity: 1,
      transform: 'translate3d(0, 0px,0)',
    },
    leave: { opacity: 0, transform: 'translate3d(0, 40px,0)' },
  })

  useEffect(() => {
    if (!goalTarget) {
      return
    }

    // Wait half-second for hatch screen to render completely.
    setTimeout(() => setShow(true), 1000)
  }, [goalTarget])

  return (
    <RootPortal>
      {screenTransitions.map(({ item, props, key }) =>
        item ? (
          <animated.div
            style={{ opacity: props.opacity }}
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${7 * GU}PX;
              background: ${theme.background.alpha(0.8)};
            `}
            key={key}
          >
            <Confetti
              width={width}
              height={height}
              numberOfPieces={
                layoutName === 'large' ? confettiPieces : confettiPieces / 3
              }
              gravity={0.5}
              friction={1.01}
              recycle={false}
              onConfettiComplete={() => setShow(false)}
            />
            <animated.div
              style={props}
              css={`
                text-align: center;
              `}
            >
              WE REACHED THE {goalTarget} GOAL! 🙌
            </animated.div>
          </animated.div>
        ) : null
      )}
    </RootPortal>
  )
}

export default GoalReachedAnimation

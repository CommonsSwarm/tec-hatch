import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { GU, RootPortal, useTheme, useViewport } from '@tecommons/ui'
import { useTransition, animated } from 'react-spring'
import { Hatch } from '../constants'

const GoalReachedAnimation = ({ hatchState }) => {
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
    if (
      hatchState !== Hatch.state.GOALREACHED &&
      hatchState !== Hatch.state.CLOSED
    ) {
      return
    }

    // Wait half-second for hatch screen to render completely.
    setTimeout(() => setShow(true), 1000)
  }, [hatchState])

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
              numberOfPieces={2000}
              gravity={0.5}
              friction={1.01}
              recycle={false}
              onConfettiComplete={() => setShow(false)}
            />
            <animated.div style={props}>WE REACHED THE GOAL! 🙌</animated.div>
          </animated.div>
        ) : null
      )}
    </RootPortal>
  )
}

export default GoalReachedAnimation

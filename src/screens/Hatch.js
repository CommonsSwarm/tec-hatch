import React from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player/youtube'
import {
  Box,
  Button,
  Timer,
  BREAKPOINTS,
  GU,
  useTheme,
  Split,
  Tag,
  LoadingRing,
  Header,
  useLayout,
  textStyle,
} from '@commonsswarm/ui'
import HatchGoal from '../components/HatchGoal'
import TECInfo from '../components/TECInfo'
import TopContributors from '../components/TopContributors'
import {
  NewContribution,
  NewRefund,
  RedeemTokens,
} from '../components/SidePanels'
import MyContributions from '../components/MyContributions'
import GoalReachedAnimation from '../components/ConfettiAnimation'

import addMilliseconds from 'date-fns/addMilliseconds'
import { Hatch } from '../constants'
import useActions from '../hooks/useActions'
import { useAppState } from '../providers/AppState'
import { useUserState } from '../providers/UserState'
import { useContributorsSubscription } from '../hooks/useSubscriptions'

const TOP_CONTRIBUTORS_COUNT = 10

export default () => {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const {
    openHatch,
    txsData: { txStatus },
  } = useActions()
  const {
    config: {
      hatchConfig: { period, openDate, state },
    },
  } = useAppState()
  const connectedUser = useUserState()
  const contributors = useContributorsSubscription({
    count: TOP_CONTRIBUTORS_COUNT,
    orderBy: 'totalValue',
    orderDirection: 'desc',
  })
  const connectedAccount = connectedUser.account
  const hatchEnded =
    state !== Hatch.state.PENDING && state !== Hatch.state.FUNDING
  const noOpenDate = state === Hatch.state.PENDING && openDate === 0
  const endDate = addMilliseconds(openDate, period)
  const videoUrl = 'https://youtu.be/sgoTeOYnv0g?t=612'

  const handleOpenHatch = () => {
    openHatch(connectedAccount)
  }

  return (
    <>
      <Header>
        <div
          css={`
            padding: ${layoutName === 'small' ? 2 * GU : 0}px;
            ${textStyle(layoutName === 'small' ? 'title4' : 'title2')};
          `}
        >
          Token Engineering Commons Hatch
        </div>
      </Header>
      <Container theme={theme}>
        <Split
          primary={
            <div>
              <div
                css={`
                  position: relative;
                  height: 0;
                  overflow: hidden;
                  padding-top: 30px;
                  padding-bottom: 56.25%;
                  margin-bottom: ${4 * GU}px;
                `}
              >
                <ReactPlayer
                  css={`
                    position: absolute;
                    top: 0;
                    left: 0;
                  `}
                  width="100%"
                  height="100%"
                  url={videoUrl}
                  controls
                />
              </div>
              <TECInfo />
            </div>
          }
          secondary={
            <div>
              <HatchGoal />
              <Box heading="Hatch Period">
                {noOpenDate && (
                  <Button
                    wide
                    mode="strong"
                    label="Open hatch"
                    onClick={handleOpenHatch}
                    disabled={!connectedAccount || !!txStatus}
                  >
                    <AlignedText>
                      {txStatus && <LoadingRing />}
                      Open hatch
                    </AlignedText>
                  </Button>
                )}
                {state === Hatch.state.CLOSED && hatchEnded && (
                  <p
                    css={`
                      font-size: 16px;
                    `}
                  >
                    Hatch closed
                  </p>
                )}
                {state === Hatch.state.GOALREACHED && (
                  <p
                    css={`
                      font-size: 16px;
                    `}
                  >
                    Hatch ended
                  </p>
                )}
                {state === Hatch.state.FUNDING && (
                  <p
                    css={`
                      font-size: 16px;
                    `}
                  >
                    Time remaining
                  </p>
                )}
                {!noOpenDate && !hatchEnded && (
                  <>
                    <Timer
                      css={`
                        margin-top: ${1 * GU}px;
                      `}
                      end={endDate}
                    />
                    <Tag
                      css={`
                        margin-top: ${2 * GU}px;
                      `}
                      label={`Hatch ends ${endDate.toLocaleDateString()}`}
                    />
                  </>
                )}
              </Box>
              {connectedUser.contributorData ? (
                <MyContributions user={connectedUser} />
              ) : null}
              {!!contributors.length && (
                <TopContributors contributors={contributors} />
              )}
            </div>
          }
          secondaryWidth={`${40 * GU}px`}
        />
      </Container>
      <GoalReachedAnimation />
      <NewContribution />
      <NewRefund />
      <RedeemTokens />
    </>
  )
}

const AlignedText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  display: flex;

  @media only screen and (max-width: ${BREAKPOINTS.large}px) {
    flex-direction: column;
  }
`

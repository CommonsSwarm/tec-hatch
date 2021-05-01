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
import GoalReachedAnimation from '../components/GoalReachedAnimation'

import addMilliseconds from 'date-fns/addMilliseconds'
import { Hatch } from '../constants'
import useActions from '../hooks/useActions'
import { useAppState } from '../providers/AppState'
import { useUserState } from '../providers/UserState'
import { useContributorsSubscription } from '../hooks/useSubscriptions'

const TOP_CONTRIBUTORS_COUNT = 10

export default () => {
  const theme = useTheme()
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
      <Header primary="Token Engineering Commons Hatch" />
      <Container theme={theme}>
        <Split
          primary={
            <div>
              <ReactPlayer
                style={{ marginBottom: 4 * GU }}
                width="100%"
                height="460px"
                url={videoUrl}
                controls
              />
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
                {hatchEnded && (
                  <p
                    css={`
                      font-size: 16px;
                    `}
                  >
                    Hatch closed
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
        />
      </Container>
      <GoalReachedAnimation hatchState={state} />
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

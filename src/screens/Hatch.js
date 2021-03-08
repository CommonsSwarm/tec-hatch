import React from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player/youtube'
import {
  Box,
  Button,
  Countdown,
  BREAKPOINTS,
  GU,
  Text,
  useTheme,
  Split,
  unselectable,
  Tag,
  LoadingRing,
} from '@tecommons/ui'
import addMilliseconds from 'date-fns/addMilliseconds'
import HatchGoal from '../components/HatchGoal'
import { Hatch } from '../constants'
import { useWallet } from '../providers/Wallet'
import useActions from '../hooks/useActions'
import { useAppState } from '../providers/AppState'
import TECInfo from '../components/TECInfo'
import {
  useContributorsSubscription,
  useContributorSubscription,
} from '../hooks/useSubscriptions'
import TopContributors from '../components/TopContributors'

const TOP_CONTRIBUTORS_COUNT = 10

export default () => {
  const theme = useTheme()
  const { account: connectedAccount } = useWallet()
  const {
    openHatch,
    txsData: { txStatus },
  } = useActions()
  const {
    config: {
      hatchConfig: { period, openDate, state },
    },
  } = useAppState()
  const contributors = useContributorsSubscription({
    count: TOP_CONTRIBUTORS_COUNT,
    orderBy: 'totalValue',
    orderDirection: 'desc',
  })
  const connectedContributor = useContributorSubscription({
    contributor: connectedAccount,
  })
  const hatchEnded =
    state !== Hatch.state.PENDING && state !== Hatch.state.FUNDING
  const noOpenDate = state === Hatch.state.PENDING && openDate === 0
  const endDate = addMilliseconds(openDate, period)
  const videoUrl = 'https://youtu.be/sgoTeOYnv0g?t=612'

  /**
   * Calls the `hatch.open` smart contract function on button click
   * @returns {void}
   */
  const handleOpenHatch = () => {
    openHatch(connectedAccount)
  }

  return (
    <>
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
              <div
                css={`
                  width: 85%;
                `}
              >
                <TECInfo />
              </div>
            </div>
          }
          secondary={
            <div>
              <HatchGoal />
              <Box heading="Fundraising Period">
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
                    <Countdown
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
              {connectedContributor && (
                <Box heading="My Contributions">
                  <div
                    css={`
                      display: flex;
                      justify-content: space-between;
                    `}
                  >
                    <p
                      css={`
                        font-size: 16px;
                      `}
                    >
                      Contributions
                    </p>
                    <Text>{connectedContributor.formattedTotalValue}</Text>
                  </div>
                  <div
                    css={`
                      display: flex;
                      justify-content: space-between;
                    `}
                  >
                    <p
                      css={`
                        font-size: 16px;
                      `}
                    >
                      Shares
                    </p>
                    <Text>{connectedContributor.formattedTotalAmount}</Text>
                  </div>
                </Box>
              )}
              {!!contributors.length && (
                <TopContributors contributors={contributors} />
              )}
            </div>
          }
        />
      </Container>
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

  a {
    color: #3e7bf6;
  }

  .circle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 18px;

    .progress-text {
      display: inherit;
    }

    & > div {
      margin-bottom: ${2 * GU}px;
    }
  }

  .filter-item {
    display: flex;
    align-items: center;
  }

  .filter-label {
    display: block;
    margin-right: 8px;
    font-variant: small-caps;
    text-transform: lowercase;
    color: ${props => props.theme.contentSecondary};
    font-weight: 600;
    white-space: nowrap;
    ${unselectable};
  }

  @media only screen and (max-width: ${BREAKPOINTS.large}px) {
    flex-direction: column;
  }
`

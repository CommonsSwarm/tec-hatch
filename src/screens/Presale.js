import React, { useState } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player/vimeo'
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
} from '@tecommons/ui'
import BigNumber from 'bignumber.js'
import addMilliseconds from 'date-fns/addMilliseconds'
import PresaleGoal from '../components/PresaleGoal'
import { Presale } from '../constants'
import { formatBigNumber } from '../utils/bn-utils'
import { useWallet } from '../providers/Wallet'
import useActions from '../hooks/useActions'
import { useAppState } from '../providers/AppState'
import TECInfo from '../components/TECInfo'
import { useContributionsSubscription } from '../hooks/useSubscriptions'
import TopContributors from '../components/TopContributors'

const TOP_CONTRIBUTORS_COUNT = 10

export default () => {
  const theme = useTheme()
  const { account: connectedAccount } = useWallet()
  const { openPresale } = useActions()
  const {
    config: { period, openDate, state, contributionToken, token },
  } = useAppState()
  const contributions = useContributionsSubscription({
    count: TOP_CONTRIBUTORS_COUNT,
    orderBy: 'value',
    orderDirection: 'desc',
  })

  const presaleEnded =
    state !== Presale.state.PENDING && state !== Presale.state.FUNDING
  const noOpenDate = state === Presale.state.PENDING && openDate === 0
  const endDate = addMilliseconds(openDate, period)
  const videoUrl = 'https://vimeo.com/112836958'

  /**
   * Calls the `presale.open` smart contarct function on button click
   * @returns {void}
   */
  const handleOpenPresale = () => {
    console.log('here')
    openPresale().catch(console.error)
  }

  let contributionList = [...contributions.entries()].map(item => {
    // Add up amount and value of every vesting period
    const reducedValues = item[1].reduce((prev, current) => {
      return {
        amount: new BigNumber(prev.amount).plus(new BigNumber(current.amount)),
        value: new BigNumber(prev.value).plus(new BigNumber(current.value)),
      }
    })

    item[1] = reducedValues

    return item
  })
  // Fetched contributions from connector are already sorted
  // .sort((a, b) => b[1].value - a[1].value)

  contributionList = contributionList.map(item => ({
    account: item[0],
    contributions:
      formatBigNumber(item[1].value, contributionToken.decimals) +
      ' ' +
      contributionToken.symbol,
    shares: formatBigNumber(item[1].amount, token.decimals),
  }))

  const myContributions = contributionList.filter(item => {
    return item.account === connectedAccount
  })[0]

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
              <PresaleGoal />
              <Box heading="Fundraising Period">
                {noOpenDate && (
                  <Button
                    wide
                    mode="strong"
                    label="Open hatch"
                    onClick={handleOpenPresale}
                    disabled={!connectedAccount}
                  >
                    Open hatch
                  </Button>
                )}
                {presaleEnded && (
                  <p
                    css={`
                      font-size: 16px;
                    `}
                  >
                    Hatch closed
                  </p>
                )}
                {state === Presale.state.FUNDING && (
                  <p
                    css={`
                      font-size: 16px;
                    `}
                  >
                    Time remaining
                  </p>
                )}
                {!noOpenDate && !presaleEnded && (
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
              {myContributions && (
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
                    <Text>{myContributions.contributions}</Text>
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
                    <Text>{myContributions.shares}</Text>
                  </div>
                </Box>
              )}
              {contributionList && (
                <TopContributors contributors={contributionList} />
              )}
            </div>
          }
        />
      </Container>
    </>
  )
}

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

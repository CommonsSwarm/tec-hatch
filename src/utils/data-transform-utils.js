import BigNumber from 'bignumber.js'
import { secondsToMilliseconds } from './date-utils'

// TODO: Need to fetch this variable from the MarketMaker contract
const PPM = 1000000

export const transformConfigData = (config, ppm = PPM) => {
  return {
    ...config,
    openDate: secondsToMilliseconds(config.openDate),
    period: secondsToMilliseconds(config.period),
    vestingCliffPeriod: secondsToMilliseconds(config.vestingCliffPeriod),
    vestingCompletePeriod: secondsToMilliseconds(config.vestingCompletePeriod),
    vestingCliffDate: secondsToMilliseconds(config.vestingCliffDate),
    vestingCompleteDate: secondsToMilliseconds(config.vestingCompleteDate),
    state: config.state.toUpperCase(),
    exchangeRate: new BigNumber(config.exchangeRate).div(ppm),
    goal: new BigNumber(config.goal),
    totalRaised: new BigNumber(config.totalRaised),
  }
}

export const transformContributionData = contribution => {
  return {
    ...contribution,
  }
}

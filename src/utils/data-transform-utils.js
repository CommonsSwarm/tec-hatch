import BigNumber from 'bignumber.js'
import { timestampToMilliseconds } from './web3-utils'

// TODO: Need to fetch this variable from the MarketMaker contract
const PPM = 1000000

export const transformConfigData = (config, ppm = PPM) => {
  return {
    ...config,
    openDate: timestampToMilliseconds(config.openDate),
    period: timestampToMilliseconds(config.period),
    vestingCliffPeriod: timestampToMilliseconds(config.vestingCliffPeriod),
    vestingCompletePeriod: timestampToMilliseconds(
      config.vestingCompletePeriod
    ),
    vestingCliffDate: timestampToMilliseconds(config.vestingCliffDate),
    vestingCompleteDate: timestampToMilliseconds(config.vestingCompleteDate),
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

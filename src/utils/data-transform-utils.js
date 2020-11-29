import BigNumber from 'bignumber.js'
import { timestampToDate } from './web3-utils'

// TODO: Need to fetch this variable from the MarketMaker contract
const PPM = 1000000

export const transformConfigData = config => {
  return {
    ...config,
    openDate: timestampToDate(config.openDate),
    state: config.state.toUpperCase(),
    exchangeRate: new BigNumber(config.exchangeRate).div(PPM),
    goal: new BigNumber(config.goal),
    totalRaised: new BigNumber(config.goal),
  }
}

export const transformContributionData = contribution => {
  return {
    ...contribution,
  }
}

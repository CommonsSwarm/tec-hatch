import BigNumber from 'bignumber.js'
import { toChecksumAddress } from '../utils/web3-utils'
import { formatBigNumber } from './bn-utils'
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
    minGoal: new BigNumber(config.minGoal),
    maxGoal: new BigNumber(config.maxGoal),
    totalRaised: new BigNumber(config.totalRaised),
  }
}

export const transformContributorData = (
  contributor,
  contributionToken,
  token
) => {
  const totalAmount = new BigNumber(contributor.totalAmount)
  const totalValue = new BigNumber(contributor.totalValue)
  return {
    ...contributor,
    account: toChecksumAddress(contributor.account),
    totalAmount,
    formattedTotalAmount:
      formatBigNumber(totalAmount, token.decimals) + ' ' + token.symbol,
    totalValue,
    formattedTotalValue:
      formatBigNumber(totalValue, contributionToken.decimals) +
      ' ' +
      contributionToken.symbol,
  }
}

export const transformContributionData = contribution => {
  return {
    ...contribution,
    contributor: toChecksumAddress(contribution.contributor),
    createdAt: secondsToMilliseconds(contribution.createdAt),
    amount: new BigNumber(contribution.amount),
    value: new BigNumber(contribution.value),
  }
}

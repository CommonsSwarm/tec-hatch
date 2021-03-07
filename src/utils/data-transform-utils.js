import BigNumber from 'bignumber.js'
import { toChecksumAddress } from '../utils/web3-utils'
import { formatBigNumber } from './bn-utils'
import { secondsToMilliseconds } from './date-utils'

export const transformConfigData = config => {
  const presaleConfig = config.presaleConfig
  const presaleOracleConfig = config.presaleOracleConfig

  return {
    ...config,
    presaleConfig: {
      ...presaleConfig,
      openDate: secondsToMilliseconds(presaleConfig.openDate),
      period: secondsToMilliseconds(presaleConfig.period),
      vestingCliffPeriod: secondsToMilliseconds(
        presaleConfig.vestingCliffPeriod
      ),
      vestingCompletePeriod: secondsToMilliseconds(
        presaleConfig.vestingCompletePeriod
      ),
      vestingCliffDate: secondsToMilliseconds(presaleConfig.vestingCliffDate),
      vestingCompleteDate: secondsToMilliseconds(
        presaleConfig.vestingCompleteDate
      ),
      state: presaleConfig.state.toUpperCase(),
      exchangeRate: new BigNumber(presaleConfig.exchangeRate).div(
        new BigNumber(presaleConfig.PPM)
      ),
      minGoal: new BigNumber(presaleConfig.minGoal),
      maxGoal: new BigNumber(presaleConfig.maxGoal),
      totalRaised: new BigNumber(presaleConfig.totalRaised),
    },
    presaleOracleConfig: {
      ...presaleOracleConfig,
      ratio: new BigNumber(presaleOracleConfig.ratio),
    },
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

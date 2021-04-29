import BigNumber from 'bignumber.js'
import { toChecksumAddress } from '../utils/web3-utils'
import { formatBigNumber } from './bn-utils'
import { secondsToMilliseconds } from './date-utils'

export const transformConfigData = config => {
  const hatchConfig = config.hatchConfig
  const hatchOracleConfig = config.hatchOracleConfig
  const PPM = new BigNumber(hatchConfig.PPM)

  return {
    ...config,
    hatchConfig: {
      ...hatchConfig,
      openDate: secondsToMilliseconds(hatchConfig.openDate),
      period: secondsToMilliseconds(hatchConfig.period),
      vestingCliffPeriod: secondsToMilliseconds(hatchConfig.vestingCliffPeriod),
      vestingCompletePeriod: secondsToMilliseconds(
        hatchConfig.vestingCompletePeriod
      ),
      vestingCliffDate: secondsToMilliseconds(hatchConfig.vestingCliffDate),
      vestingCompleteDate: secondsToMilliseconds(
        hatchConfig.vestingCompleteDate
      ),
      state: hatchConfig.state.toUpperCase(),
      exchangeRate: new BigNumber(hatchConfig.exchangeRate).div(PPM),
      fundingForBeneficiaryPct: new BigNumber(
        hatchConfig.fundingForBeneficiaryPct
      ).div(PPM),
      supplyOfferedPct: new BigNumber(hatchConfig.supplyOfferedPct).div(PPM),
      minGoal: new BigNumber(hatchConfig.minGoal),
      maxGoal: new BigNumber(hatchConfig.maxGoal),
      totalRaised: new BigNumber(hatchConfig.totalRaised),
    },
    hatchOracleConfig: {
      ...hatchOracleConfig,
      ratio: new BigNumber(hatchOracleConfig.ratio),
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

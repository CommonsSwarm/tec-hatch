import cloneDeep from 'lodash/cloneDeep'
import BigNumber from 'bignumber.js'

/**
 * Checks whether we have enough data to start the fundraising app
 * @param {Object} state - the background script state
 * @returns {boolean} true if ready, false otherwise
 */
export const ready = state => {
  const synced = !state?.isSyncing
  const hasCollaterals = state?.collaterals.size > 0
  const presaleStateIsKnown = state?.presale?.state
  return synced && hasCollaterals && presaleStateIsKnown
}


/**
 * Converts constants to big numbers
 * @param {Object} constants - background script constants data
 * @returns {Object} transformed constants
 */
export const computeConstants = constants => ({
  ...constants,
  PPM: new BigNumber(constants.PPM),
  PCT_BASE: new BigNumber(constants.PCT_BASE),
})

/**
 * Converts constants to big numbers
 * @param {Object} values - background script values data
 * @returns {Object} transformed constants
 */
export const computeValues = values => ({
  ...values,
  buyFeePct: new BigNumber(values.buyFeePct),
  sellFeePct: new BigNumber(values.sellFeePct),
})

/**
 * Compute some data related to the presale
 * @param {Object} presale - background script presale data
 * @param {BigNumber} PPM - part per million
 * @returns {Object} transformed presale
 */
export const computePresale = (presale, PPM) => ({
  ...presale,
  exchangeRate: new BigNumber(presale.exchangeRate).div(PPM),
  goal: new BigNumber(presale.goal),
  totalRaised: new BigNumber(presale.totalRaised),
})

/**
 * Converts collateral strings to BigNumber where needed
 * TODO: handle balances when PR#361 lands
 * @param {String} address - collateral address
 * @param {Object} data - collateral data
 * @returns {Object} transformed collateral
 */
const transformCollateral = (address, data) => {
  const virtualBalance = new BigNumber(data.virtualBalance)
  const actualBalance = new BigNumber(data.actualBalance)
  const realBalance = actualBalance
  const overallBalance = realBalance.plus(virtualBalance)
  return {
    address,
    ...data,
    reserveRatio: new BigNumber(data.reserveRatio),
    virtualSupply: new BigNumber(data.virtualSupply),
    slippage: new BigNumber(data.slippage),
    virtualBalance,
    actualBalance,
    realBalance,
    overallBalance
  }
}

/**
 * Converts the background script collaterals to an object with BigNumbers for a better handling in the frontend
 * @param {Map} collaterals - background script collaterals data
 * @returns {Object} the computed collaterals
 */
export const computeCollaterals = collaterals => {
  const computedCollaterals = Array.from(cloneDeep(collaterals))
  const primaryCollateralSymbol = computedCollaterals[0][1].symbol
  const [primaryCollateralAddress, primaryCollateralData] = computedCollaterals.find(([_, data]) => data.symbol === primaryCollateralSymbol)
  return {
    primaryCollateral: transformCollateral(primaryCollateralAddress, primaryCollateralData),
  }
}

/**
 * Converts the background script bondedToken with BigNumbers for a better handling in the frontend
 * @param {Object} bondedToken - background script bondedToken data
 * @param {Object} collaterals - fundraising collaterals
 * @returns {Object} the computed bondedToken
 */
export const computeBondedToken = (bondedToken, { primaryCollateral }) => {
  const totalSupply = new BigNumber(bondedToken.totalSupply)
  const realSupply = totalSupply
  return {
    ...bondedToken,
    totalSupply,
    realSupply,
    overallSupply: {
      primaryCollateral: realSupply.plus(primaryCollateral.virtualSupply),
    },
  }
}

/**
 * Converts the background script orders with BigNumbers for a better handling in the frontend
 * Also update the price of the order
 * @param {Array} orders - background script orders data
 * @returns {Object} the computed orders
 */
export const computeOrders = (orders) => {
  return orders.map(order => {
    const feePct = new BigNumber(order.feePct)
    const fee = new BigNumber(order.fee)
    const value = new BigNumber(order.value)
    const amount = new BigNumber(order.amount)
    const price = value.plus(fee).div(amount)

    return {
      ...order,
      price,
      amount,
      value,
      fee,
      feePct
    }
  })
}

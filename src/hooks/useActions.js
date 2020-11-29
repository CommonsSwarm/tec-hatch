import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { getAppByName } from '../utils/connector-utils'
import { useContract } from './useContract'

import MarketMakerAbi from '../abi/BancorMarketMaker.json/'
import TokenAbi from '../abi/Token.json'

const GAS_LIMIT = 450000
const APP_NAME = process.env.REACT_APP_PRESALE_APP_NAME
const MARKET_MAKER_ADDRESS = process.env.REACT_APP_MARKETMAKER_APP_ADDRESS

const EMPTY_TOKEN = { id: '', symbol: '', decimals: 18 }

const computeTokenValue = (value, decimals) =>
  new BigNumber(Math.floor(parseInt(value, 10) / Math.pow(10, decimals)))

const useActions = (onDone = () => {}) => {
  const { account, ethers } = useWallet()
  const { installedApps, config } = useAppState()
  const token = config ? config.contributionToken : EMPTY_TOKEN
  const marketMaker = useContract(MARKET_MAKER_ADDRESS, MarketMakerAbi)
  const contributionToken = useContract(token.id, TokenAbi)
  const presaleApp = getAppByName(installedApps, APP_NAME)

  const openPresale = useCallback(async () => {
    sendIntent(presaleApp, 'openPresale', [], { ethers, from: account })

    onDone()
  }, [account, presaleApp, ethers, onDone])

  const closePresale = useCallback(() => {
    sendIntent(presaleApp, 'closePresale', [], { ethers, from: account })

    onDone()
  }, [account, presaleApp, ethers, onDone])

  const contribute = useCallback(
    async (contributor, value) => {
      sendIntent(presaleApp, 'contribute', [contributor, value], {
        ethers,
        from: account,
      })

      onDone()
    },
    [account, presaleApp, ethers, onDone]
  )

  const refund = useCallback(
    async (contributor, vestedPurchaseId) => {
      sendIntent(presaleApp, 'refund', [contributor, vestedPurchaseId], {
        ethers,
        from: account,
      })

      onDone()
    },
    [account, presaleApp, ethers, onDone]
  )

  const getCollateralAllowance = useCallback(
    async (owner, spender) => {
      const allowance = await contributionToken.allowance(owner, spender)
      return computeTokenValue(allowance)
    },
    [contributionToken]
  )

  const approveCollateralAllowance = useCallback(
    async (spender, amount) => {
      const success = await contributionToken.approve(spender, amount)
      return success
    },
    [contributionToken]
  )

  const getEntityTokenBalance = useCallback(
    async (entity, tokenAddress, decimals) => {
      const balance = await marketMaker.balanceOf(entity, tokenAddress)
      return computeTokenValue(balance)
    },
    [marketMaker]
  )

  return {
    openPresale,
    closePresale,
    contribute,
    refund,
    getCollateralAllowance,
    approveCollateralAllowance,
    getEntityTokenBalance,
  }
}

const sendIntent = async (app, fn, params, { ethers, from }) => {
  try {
    const intent = await app.intent(fn, params, { actAs: from })
    const { to, data } = intent.transactions[0] // TODO: Handle errors when no tx path is found

    ethers.getSigner().sendTransaction({ data, to, gasLimit: GAS_LIMIT })
  } catch (err) {
    console.error('Could not create tx:', err)
  }
}

export default useActions

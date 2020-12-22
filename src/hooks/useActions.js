import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { useContract } from './useContract'
import TokenAbi from '../abi/Token.json'

// const GAS_LIMIT = 600000
const PRESALE_ADDRESS = process.env.REACT_APP_PRESALE_APP_ADDRESS

const useActions = (onDone = () => {}) => {
  const { account, web3 } = useWallet()
  const { organization, config } = useAppState()
  const token = config ? config.contributionToken : {}

  const contributionToken = useContract(token.id, TokenAbi)

  const openPresale = useCallback(async () => {
    sendIntent(organization, PRESALE_ADDRESS, 'open', [], {
      web3,
      from: account,
    })

    onDone()
  }, [account, organization, web3, onDone])

  const closePresale = useCallback(() => {
    sendIntent(organization, PRESALE_ADDRESS, 'close', [], {
      web3,
      from: account,
    })

    onDone()
  }, [account, organization, web3, onDone])

  const contribute = useCallback(
    async value => {
      sendIntent(
        organization,
        PRESALE_ADDRESS,
        'contribute',
        [value],
        {
          web3,
          from: account,
        },
        { onTxCreated: onDone, onError: onDone }
      )
    },
    [account, organization, web3, onDone]
  )

  const refund = useCallback(
    async (contributor, vestedPurchaseId) => {
      sendIntent(
        organization,
        PRESALE_ADDRESS,
        'refund',
        [contributor, vestedPurchaseId],
        { web3, from: account },
        { onTxCreated: onDone, onError: onDone }
      )
    },
    [account, organization, web3, onDone]
  )

  const getCollateralAllowance = useCallback(
    async (owner, spender) => {
      const allowance = await contributionToken.methods
        .allowance(owner, spender)
        .call({ from: account })
      return new BigNumber(allowance)
    },
    [contributionToken, account]
  )

  const approveCollateralAllowance = useCallback(
    async (spender, amount) => {
      const success = await contributionToken.methods
        .approve(spender, amount)
        .send({ from: account })
      return success
    },
    [contributionToken, account]
  )

  const getEntityTokenBalance = useCallback(
    async entity => {
      const balance = await contributionToken.methods
        .balanceOf(entity)
        .call({ from: account })
      return new BigNumber(balance)
    },
    [contributionToken, account]
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

const sendIntent = async (
  org,
  appAddress,
  fn,
  params,
  { web3, from },
  { onTxCreated = () => {}, onCompleted = () => {}, onError = () => {} } = {}
) => {
  try {
    const intent = org.appIntent(appAddress, fn, params)
    const [tx] = await intent.transactions(from)
    const { data, to } = tx

    web3.eth
      .sendTransaction({ from, to, data })
      .on('transactionHash', onTxCreated)
      .on('receipt', onCompleted)
      .on('error', onError)
  } catch (err) {
    onError(err)
  }
}

export default useActions

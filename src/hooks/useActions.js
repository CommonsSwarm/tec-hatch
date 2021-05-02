import { useCallback, useMemo } from 'react'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { convertBN } from '../utils/bn-utils'
import useTxExecution from './useTxExecution'

const TX_GAS_LIMIT = 900000
const PRE_TX_GAS_LIMIT = 700000

const useActions = (onClose = () => {}) => {
  const { ethers } = useWallet()
  const {
    txHandlers,
    txStatus,
    preTxStatus,
    txCounter,
    txCurrentIndex,
  } = useTxExecution()
  const signer = useMemo(() => ethers?.getSigner(), [ethers])
  const { hatchConnector, redemptionsApp } = useAppState()

  const {
    onTxsFetched,
    onTxSigning,
    onTxSigned,
    onTxSuccess,
    onTxError,
  } = txHandlers

  const executeAction = useCallback(
    async ({ transactions = [] } = {}) => {
      const txLength = transactions.length

      if (!txLength) {
        return
      }
      onTxsFetched(txLength)

      try {
        for (let i = 0; i < txLength; i++) {
          const tx = transactions[i]

          onTxSigning(tx, i, txLength)

          const txResponse = await signer.sendTransaction({
            ...tx,
            gasLimit: i < txLength - 1 ? PRE_TX_GAS_LIMIT : TX_GAS_LIMIT,
          })

          onTxSigned(txResponse, i, txLength)

          // If we've signed the last tx then call the close function.
          if (i === txLength - 1) {
            onClose()
          }

          const txReceipt = await txResponse.wait()

          onTxSuccess(txReceipt, i, txLength)
        }
      } catch (err) {
        console.error(err)
        onClose()
        onTxError(err)
      }
    },
    [
      signer,
      onTxsFetched,
      onTxSigning,
      onTxSigned,
      onTxSuccess,
      onTxError,
      onClose,
    ]
  )

  const openHatch = useCallback(
    async signerAddress => {
      const intent = await hatchConnector.open(signerAddress)

      executeAction(intent)
    },
    [hatchConnector, executeAction]
  )

  const closeHatch = useCallback(
    async signerAddress => {
      const intent = await hatchConnector.close(signerAddress)

      executeAction(intent)
    },
    [hatchConnector, executeAction]
  )

  const contribute = useCallback(
    async (contributor, value) => {
      const intent = await hatchConnector.contribute(contributor, value)

      executeAction(intent)
    },
    [hatchConnector, executeAction]
  )

  const refund = useCallback(
    async (contributor, vestedPurchaseId) => {
      const intent = await hatchConnector.refund(contributor, vestedPurchaseId)

      executeAction(intent)
    },
    [hatchConnector, executeAction]
  )

  const redeem = useCallback(
    async amount => {
      const intent = await redemptionsApp.intent('redeem', [amount], {
        actAs: await signer.getAddress(),
      })
      executeAction(intent)
    },
    [signer, redemptionsApp, executeAction]
  )

  const getContributionTokenBalance = useCallback(
    async entity => {
      return convertBN(await hatchConnector.contributionTokenBalance(entity))
    },
    [hatchConnector]
  )

  const getAllowedContributionAmount = useCallback(
    async entity => {
      return convertBN(await hatchConnector.allowedContributionAmount(entity))
    },
    [hatchConnector]
  )

  const getAwardedTokensAmount = useCallback(
    async entity => {
      return convertBN(await hatchConnector.awardedTokenAmount(entity))
    },
    [hatchConnector]
  )

  const getReserveTokenBalance = useCallback(async () => {
    return convertBN(await hatchConnector.reserveTokenBalance())
  }, [hatchConnector])

  const getTokenTotalSupply = useCallback(async token => {
    return convertBN(await token.totalSupply())
  }, [])

  return {
    openHatch,
    closeHatch,
    contribute,
    refund,
    redeem,
    getContributionTokenBalance,
    getAllowedContributionAmount,
    getAwardedTokensAmount,
    getTokenTotalSupply,
    getReserveTokenBalance,
    txsData: {
      txStatus,
      preTxStatus,
      txCounter,
      txCurrentIndex,
    },
  }
}

export default useActions

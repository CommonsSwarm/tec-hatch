import { useCallback, useMemo } from 'react'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { convertBN } from '../utils/bn-utils'
import { useContract } from './useContract'
import useTxExecution from './useTxExecution'

// const TX_GAS_LIMIT = 850000
const TX_GAS_LIMIT = 9000000
const PRE_TX_GAS_LIMIT = 200000

const useActions = () => {
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
  const redemptions = useContract(
    redemptionsApp?.address,
    redemptionsApp?.abi,
    signer
  )

  const {
    onTxsFetched,
    onTxSigning,
    onTxSigned,
    onTxSuccess,
    onTxError,
  } = txHandlers

  console.log(redemptions)
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

          const txReceipt = await txResponse.wait()

          onTxSuccess(txReceipt, i, txLength)
        }
      } catch (err) {
        console.error(err)
        onTxError(err)
      }
    },
    [signer, onTxsFetched, onTxSigning, onTxSigned, onTxSuccess, onTxError]
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
      const txResponse = await redemptions.redeem(amount)
      await txResponse.wait()
    },
    [redemptions]
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

  return {
    openHatch,
    closeHatch,
    contribute,
    refund,
    redeem,
    getContributionTokenBalance,
    getAllowedContributionAmount,
    getAwardedTokensAmount,
    txsData: {
      txStatus,
      preTxStatus,
      txCounter,
      txCurrentIndex,
    },
  }
}

export default useActions

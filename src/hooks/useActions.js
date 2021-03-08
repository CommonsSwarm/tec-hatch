import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import useTxExecution from './useTxExecution'
import { transformContributorData } from '../utils/data-transform-utils'

const TX_GAS_LIMIT = 850000
const PRE_TX_GAS_LIMIT = 50000

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
  const {
    hatchConnector,
    config: {
      hatchConfig: { contributionToken, token },
    },
  } = useAppState()
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

  const getAccountTokenBalance = useCallback(
    async entity => {
      const balance = await hatchConnector.tokenBalance(entity)
      /**
       * Connector uses ethers' lower-version BigNumber.js
       * library which returns a BigNumber with a hex field only
       */
      return new BigNumber(balance.toHexString(), 16)
    },
    [hatchConnector]
  )

  const getAllowedContributionAmount = useCallback(
    async entity => {
      const allowedAmount = await hatchConnector.getAllowedContributionAmount(
        entity
      )

      return new BigNumber(allowedAmount.toHexString(), 16)
    },
    [hatchConnector]
  )

  const getContributor = useCallback(
    async entity => {
      try {
        const contributor = await hatchConnector.contributor(entity)

        return transformContributorData(contributor, contributionToken, token)
      } catch (err) {
        return null
      }
    },
    [hatchConnector, contributionToken, token]
  )

  return {
    openHatch,
    closeHatch,
    contribute,
    refund,
    getAccountTokenBalance,
    getAllowedContributionAmount,
    getContributor,
    txsData: {
      txStatus,
      preTxStatus,
      txCounter,
      txCurrentIndex,
    },
  }
}

export default useActions

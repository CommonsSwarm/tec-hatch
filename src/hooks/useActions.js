import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import useTxExecution from './useTxExecution'
import { transformContributorData } from '../utils/data-transform-utils'

const TX_GAS_LIMIT = 850000
const PRE_TX_GAS_LIMIT = 450000

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
    presaleConnector,
    config: {
      presaleConfig: { contributionToken, token },
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
      const intent = await presaleConnector.open(signerAddress)

      executeAction(intent)
    },
    [presaleConnector, executeAction]
  )

  const closeHatch = useCallback(
    async signerAddress => {
      const intent = await presaleConnector.close(signerAddress)

      executeAction(intent)
    },
    [presaleConnector, executeAction]
  )

  const contribute = useCallback(
    async (contributor, value) => {
      const intent = await presaleConnector.contribute(contributor, value)

      executeAction(intent)
    },
    [presaleConnector, executeAction]
  )

  const refund = useCallback(
    async (contributor, vestedPurchaseId) => {
      const intent = await presaleConnector.refund(
        contributor,
        vestedPurchaseId
      )

      executeAction(intent)
    },
    [presaleConnector, executeAction]
  )

  const getAccountTokenBalance = useCallback(
    async entity => {
      const balance = await presaleConnector.tokenBalance(entity)
      /**
       * Connector uses ethers' lower-version BigNumber.js
       * library which returns a BigNumber with a hex field only
       */
      return new BigNumber(balance.toHexString(), 16)
    },
    [presaleConnector]
  )

  const getAllowedContributionAmount = useCallback(
    async entity => {
      const allowedAmount = await presaleConnector.getAllowedContributionAmount(
        entity
      )

      return new BigNumber(allowedAmount.toHexString(), 16)
    },
    [presaleConnector]
  )

  const getContributor = useCallback(
    async entity => {
      const contributor = await presaleConnector.contributor(entity)

      return transformContributorData(contributor, contributionToken, token)
    },
    [presaleConnector, contributionToken, token]
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

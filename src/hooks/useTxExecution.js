import React, { useCallback, useState, useEffect } from 'react'
import { useToast } from '@aragon/ui'
import useMounted from './useMounted'
import {
  PendingSnackbar,
  ErrorSnackbar,
  ConfirmedSnackbar,
} from '../components/TransactionSnackbars'
import { TxStatuses } from '../constants'

const {
  TX_SIGNING,
  TX_MINING,
  TX_SUCCESS,
  TX_ERROR,
  PRE_TX_PROCESSING,
  PRE_TX_FINISHED,
} = TxStatuses

const useTxExecution = () => {
  const mounted = useMounted()
  const toast = useToast()
  const [preTxStatus, setPreTxStatus] = useState(null)
  const [txStatus, setTxStatus] = useState(null)
  const [txCounter, setTxCounter] = useState(0)
  const [txCurrentIndex, setTxCurrentIndex] = useState(0)

  useEffect(() => {
    if (txStatus !== TX_ERROR) {
      return
    }
    setTxStatus(null)
    setPreTxStatus(null)
    setTxCounter(0)
    setTxCurrentIndex(0)

    return () => {}
  }, [txStatus])

  const onTxsFetched = useCallback(
    txLength => {
      if (mounted()) {
        if (txLength === 1) {
          setPreTxStatus(PRE_TX_FINISHED)
        } else {
          setPreTxStatus(PRE_TX_PROCESSING)
        }
        setTxCounter(txLength)
        setTxCurrentIndex(1)
      }
    },
    [mounted]
  )

  const onTxSigning = useCallback(
    tx => {
      if (mounted()) {
        setTxStatus(TX_SIGNING)
      }
    },
    [mounted]
  )

  const onTxSigned = useCallback(
    (txResponse, txIndex, txLength) => {
      const isLastTransaction = txIndex === txLength - 1
      if (isLastTransaction) {
        toast(<PendingSnackbar />)
      }

      if (mounted()) {
        setTxStatus(TX_MINING)
      }
    },
    [toast, mounted]
  )

  const onTxSuccess = useCallback(
    (txReceipt, txIndex, txLength) => {
      const isLastPreTransaction = txLength > 1 && txIndex === txLength - 2
      const isLastTransaction = txIndex === txLength - 1

      if (mounted()) {
        setTxCurrentIndex(prevTxCurrentIndex => prevTxCurrentIndex + 1)
        setTxStatus(TX_SUCCESS)
      }

      if (isLastTransaction) {
        toast(<ConfirmedSnackbar />)
      } else if (isLastPreTransaction && mounted()) {
        setPreTxStatus(PRE_TX_FINISHED)
      }
    },
    [toast, mounted]
  )

  const onTxError = useCallback(
    err => {
      if (mounted()) {
        setTxStatus(TX_ERROR)
      }
      toast(<ErrorSnackbar userRejected={err.code === 4001} />)
    },
    [toast, mounted]
  )

  return {
    preTxStatus,
    txStatus,
    txCounter,
    txCurrentIndex,
    txHandlers: {
      onTxsFetched,
      onTxSigning,
      onTxSigned,
      onTxSuccess,
      onTxError,
    },
    setTxStatus,
  }
}

export default useTxExecution

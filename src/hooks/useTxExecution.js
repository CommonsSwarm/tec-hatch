import React, { useCallback, useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { LoadingRing } from '@aragon/ui'
import useMounted from './useMounted'
import { TxStatuses, SNACKBAR_TX_DESCRIPTIONS } from '../constants'

const {
  TX_SIGNING,
  TX_MINING,
  TX_SUCCESS,
  TX_ERROR,
  PRE_TX_PROCESSING,
  PRE_TX_FINISHED,
} = TxStatuses

const txSnackbars = new Map()

const useTxExecution = () => {
  const mounted = useMounted()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
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
        const snackbarKey = enqueueSnackbar(
          <div
            css={`
              display: flex;
              flex-direction: row;
            `}
          >
            <LoadingRing />{' '}
            <span
              css={`
                margin-left: 6px;
              `}
            >
              {SNACKBAR_TX_DESCRIPTIONS[TX_MINING]}
            </span>
          </div>,
          { persist: true }
        )
        txSnackbars.set(txIndex, snackbarKey)
      }

      if (mounted()) {
        setTxStatus(TX_MINING)
      }
    },
    [enqueueSnackbar, mounted]
  )

  const onTxSuccess = useCallback(
    (txReceipt, txIndex, txLength) => {
      const isLastPreTransaction = txLength > 1 && txIndex === txLength - 2
      const isLastTransaction = txIndex === txLength - 1

      if (txSnackbars.has(txIndex)) {
        closeSnackbar(txSnackbars.get(txIndex))
        txSnackbars.delete(txIndex)
      }

      if (mounted()) {
        setTxCurrentIndex(prevTxCurrentIndex => prevTxCurrentIndex + 1)
        setTxStatus(TX_SUCCESS)
      }

      if (isLastTransaction) {
        enqueueSnackbar(SNACKBAR_TX_DESCRIPTIONS[TX_SUCCESS], {
          variant: 'success',
        })
      } else if (isLastPreTransaction && mounted()) {
        setPreTxStatus(PRE_TX_FINISHED)
      }
    },
    [enqueueSnackbar, closeSnackbar, mounted]
  )

  const onTxError = useCallback(
    err => {
      if (mounted()) {
        setTxStatus(TX_ERROR)
      }

      enqueueSnackbar(
        err.code === 4001
          ? 'Transaction rejected by user'
          : SNACKBAR_TX_DESCRIPTIONS[TX_ERROR],
        {
          variant: 'error',
        }
      )
    },
    [enqueueSnackbar, mounted]
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
  }
}

export default useTxExecution

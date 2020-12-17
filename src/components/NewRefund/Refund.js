import React, { useContext } from 'react'
import { Button, Info, GU, LoadingRing } from '@aragon/ui'
import Information from './Information'
import { formatBigNumber } from '../../utils/bn-utils'
import { useWallet } from '../../providers/Wallet'
import useActions from '../../hooks/useActions'
import { useAppState } from '../../providers/AppState'
import { PresaleViewContext } from '../../context'
import { useContributionsSubscription } from '../../hooks/useSubscriptions'

export default () => {
  const { account } = useWallet()
  const { refund } = useActions((err, a) => {
    if (err) {
      console.error(err)
    }
    setCreatingTx(false)
    setRefundPanel(false)
  })
  const {
    config: {
      contributionToken: { symbol, decimals },
    },
  } = useAppState()

  const contributions = useContributionsSubscription({
    contributor: account,
    orderBy: 'value',
    orderDirection: 'desc',
  })
  const { setRefundPanel, creatingTx, setCreatingTx } = useContext(
    PresaleViewContext
  )
  const handleRefund = vestedPurchaseId => {
    if (account) {
      setCreatingTx(true)
      refund(account, vestedPurchaseId)
    }
  }

  return (
    <div>
      {account &&
        contributions?.get(account)?.length > 0 &&
        contributions.get(account).map(c => {
          return (
            <div
              key={c.vestedPurchaseId}
              css={`
                margin: ${4 * GU}px 0;
              `}
            >
              <Button
                mode="strong"
                wide
                onClick={() => handleRefund(c.vestedPurchaseId)}
                disabled={creatingTx}
              >
                {creatingTx ? (
                  <div>
                    <LoadingRing />
                  </div>
                ) : (
                  <span>
                    Refund contribution of {formatBigNumber(c.value, decimals)}{' '}
                    {symbol}
                  </span>
                )}
              </Button>
            </div>
          )
        })}
      {account && contributions?.get(account)?.length > 0 && <Information />}
      {(!account || !contributions?.get(account)?.length > 0) && (
        <Info
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          You don't have any contribution to refund.
        </Info>
      )}
    </div>
  )
}

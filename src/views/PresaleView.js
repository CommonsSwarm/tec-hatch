import React, { useState, useEffect } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import BigNumber from 'bignumber.js'
import { Header, Button } from '@aragon/ui'
import { useInterval } from '../hooks/use-interval'
import { useAppLogic } from '../hooks/useAppLogic'
import { useWallet } from '../providers/Wallet'

import { Presale as PresaleConstants, Polling } from '../constants'
import Presale from '../screens/Presale'
import NewContribution from '../components/NewContribution'
import NewRefund from '../components/NewRefund'
import { PresaleViewContext } from '../context'
// import { IdentityProvider } from '../components/IdentityManager'

export default () => {
  const { account: connectedUser } = useWallet()
  const {
    actions: { getEntityTokenBalance },
    config: {
      state,
      contributionToken: {
        id: contributionAddress,
        decimals: contributionDecimals,
      },
    },
  } = useAppLogic()
  const [presalePanel, setPresalePanel] = useState(false)
  const [refundPanel, setRefundPanel] = useState(false)
  // *****************************
  // context state
  // *****************************
  const [
    userPrimaryCollateralBalance,
    setUserPrimaryCollateralBalance,
  ] = useState(new BigNumber(0))
  const context = {
    userPrimaryCollateralBalance: userPrimaryCollateralBalance,
    presalePanel,
    setPresalePanel,
    refundPanel,
    setRefundPanel,
  }

  // *****************************
  // identity handlers
  // *****************************
  // const handleResolveLocalIdentity = address => {
  //   return api.resolveAddressIdentity(address).toPromise()
  // }
  // const handleShowLocalIdentityModal = address => {
  //   return api.requestAddressIdentityModification(address).toPromise()
  // }

  // watch for a connected user and get its balances
  useEffect(() => {
    const getUserPrimaryCollateralBalance = async () => {
      const balance = await getEntityTokenBalance(
        connectedUser,
        contributionAddress,
        contributionDecimals
      )
      setUserPrimaryCollateralBalance(balance)
    }
    if (connectedUser) {
      getUserPrimaryCollateralBalance()
    }
  }, [
    connectedUser,
    contributionAddress,
    contributionDecimals,
    getEntityTokenBalance,
  ])

  // polls the start date
  useInterval(async () => {
    let newUserPrimaryCollateralBalance = userPrimaryCollateralBalance
    // only poll if there is a connected user
    if (connectedUser) {
      newUserPrimaryCollateralBalance = await getEntityTokenBalance(
        connectedUser,
        contributionAddress,
        contributionDecimals
      )
    }
    // TODO: keep an eye on React 17
    batchedUpdates(() => {
      // only update if values are different
      if (!newUserPrimaryCollateralBalance.eq(userPrimaryCollateralBalance))
        setUserPrimaryCollateralBalance(newUserPrimaryCollateralBalance)
    })
  }, Polling.DURATION)

  return (
    <PresaleViewContext.Provider value={context}>
      {/* <IdentityProvider
        onResolve={handleResolveLocalIdentity}
        onShowLocalIdentityModal={handleShowLocalIdentityModal}
      > */}
      <Header
        primary="Token Engineering Commons Hatch"
        secondary={
          <Button
            disabled={state !== PresaleConstants.state.FUNDING}
            mode="strong"
            label="Buy hatch shares"
            onClick={() => setPresalePanel(true)}
          />
        }
      />
      <Presale />
      <NewContribution />
      <NewRefund />
      {/* </IdentityProvider> */}
    </PresaleViewContext.Provider>
  )
}

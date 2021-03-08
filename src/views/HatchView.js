import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Header } from '@tecommons/ui'
import { useInterval } from '../hooks/use-interval'
import { useWallet } from '../providers/Wallet'

import { Polling } from '../constants'
import Hatch from '../screens/Hatch'
import NewContribution from '../components/NewContribution'
import NewRefund from '../components/NewRefund'
import { HatchViewContext } from '../context'
import useActions from '../hooks/useActions'
// import { IdentityProvider } from '../components/IdentityManager'

export default () => {
  const { account: connectedUser } = useWallet()
  const { getAccountTokenBalance, getAllowedContributionAmount } = useActions()
  const [hatchPanel, setHatchPanel] = useState(false)
  const [refundPanel, setRefundPanel] = useState(false)
  // *****************************
  // context state
  // *****************************
  const [
    userPrimaryCollateralBalance,
    setUserPrimaryCollateralBalance,
  ] = useState(new BigNumber(0))
  const [
    userAllowedContributionAmount,
    setUserAllowedContributionAmount,
  ] = useState(new BigNumber(0))

  const context = {
    userPrimaryCollateralBalance,
    userAllowedContributionAmount,
    hatchPanel,
    setHatchPanel,
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

  // watch for a connected user and get its token data
  useEffect(() => {
    const getUserTokenData = async () => {
      const balance = await getAccountTokenBalance(connectedUser)
      const availableAmount = await getAllowedContributionAmount(connectedUser)
      setUserPrimaryCollateralBalance(balance)
      setUserAllowedContributionAmount(availableAmount)
    }
    if (connectedUser) {
      getUserTokenData()
    } else {
      setUserPrimaryCollateralBalance(new BigNumber(0))
      setUserAllowedContributionAmount(new BigNumber(0))
    }
  }, [
    connectedUser,
    getAccountTokenBalance,
    getAllowedContributionAmount,
    setUserPrimaryCollateralBalance,
    setUserAllowedContributionAmount,
  ])

  // polls the start date
  useInterval(async () => {
    let newUserPrimaryCollateralBalance = userPrimaryCollateralBalance
    let newUserAllowedContributionAmount = userAllowedContributionAmount

    // only poll if there is a connected user
    if (connectedUser) {
      newUserPrimaryCollateralBalance = await getAccountTokenBalance(
        connectedUser
      )
      newUserAllowedContributionAmount = await getAllowedContributionAmount(
        connectedUser
      )
    }

    if (!newUserPrimaryCollateralBalance.eq(userPrimaryCollateralBalance)) {
      setUserPrimaryCollateralBalance(newUserPrimaryCollateralBalance)
    }

    if (!newUserAllowedContributionAmount.eq(userAllowedContributionAmount)) {
      setUserAllowedContributionAmount(newUserAllowedContributionAmount)
    }
  }, Polling.DURATION)

  return (
    <HatchViewContext.Provider value={context}>
      {/* <IdentityProvider
        onResolve={handleResolveLocalIdentity}
        onShowLocalIdentityModal={handleShowLocalIdentityModal}
      > */}
      <Header primary="Token Engineering Commons Hatch" />
      <Hatch />
      <NewContribution />
      <NewRefund />
      {/* </IdentityProvider> */}
    </HatchViewContext.Provider>
  )
}

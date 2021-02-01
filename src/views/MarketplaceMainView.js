import React, { useCallback, useEffect, useState } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { useApi, useAppState, useConnectedAccount } from '@aragon/api-react'
import {
  Header,
  Tabs,
  Button,
  useLayout,
  ContextMenu,
  ContextMenuItem,
} from '@tecommons/ui'
import BigNumber from 'bignumber.js'
import { useInterval } from '../hooks/use-interval'
import NewOrder from '../components/NewOrder'
import Reserves from '../screens/Reserves'
import Orders from '../screens/Orders'
import Overview from '../screens/Overview'
import marketMaker from '../abi/BancorMarketMaker.json'
import { MainViewContext } from '../context'
import { Polling } from '../constants'
import { IdentityProvider } from '../components/IdentityManager'
import { spendableBalanceOf } from '../helpers.js/tokens'

const tabs = ['Overview', 'Orders', 'My Orders', 'Settings']

export default () => {
  // *****************************
  // background script state
  // *****************************
  const {
    addresses: { marketMaker: marketMakerAddress, pool },
    constants: { PPM },
    bondedToken: {
      overallSupply: { primaryCollateral: primaryCollateralSupply },
      address: bondedTokenAddress,
    },
    collaterals: {
      primaryCollateral: {
        address: primaryCollateralAddress,
        reserveRatio,
        virtualBalance: primaryCollateralVirtualBalance,
        overallBalance: primaryCollateralOverallBalance,
      },
    },
  } = useAppState()

  // *****************************
  // aragon api
  // *****************************
  const api = useApi()
  const marketMakerContract = api.external(marketMakerAddress, marketMaker)

  // *****************************
  // layout name and connectedUser
  // *****************************
  const { name: layoutName } = useLayout()
  const connectedUser = useConnectedAccount()

  // *****************************
  // internal state, also shared through context
  // *****************************
  const [tabIndex, setTabindex] = useState(0)
  const [orderPanel, setOrderPanel] = useState(false)

  // *****************************
  // context state
  // *****************************
  const [polledReserveBalance, setPolledReserveBalance] = useState(null)
  const [
    polledPrimaryCollateralBalance,
    setPolledPrimaryCollateralBalance,
  ] = useState(primaryCollateralOverallBalance)
  const [polledPrice, setPolledPrice] = useState(0)
  const [userBondedTokenBalance, setUserBondedTokenBalance] = useState(
    new BigNumber(0)
  )
  const [
    userPrimaryCollateralBalance,
    setUserPrimaryCollateralBalance,
  ] = useState(new BigNumber(0))

  // react context accessible on child components
  const context = {
    reserveBalance: polledReserveBalance,
    primaryCollateralBalance: polledPrimaryCollateralBalance,
    price: polledPrice,
    orderPanel,
    setOrderPanel,
    userBondedTokenBalance,
    userPrimaryCollateralBalance: userPrimaryCollateralBalance,
  }

  const getUserBalances = useCallback(
    async connectedUser => {
      const primaryCollateralBalance = await api
        .call('balanceOf', connectedUser, primaryCollateralAddress)
        .toPromise()

      // get bonded spendable balance
      const bondedBalance = await spendableBalanceOf(
        bondedTokenAddress,
        connectedUser,
        api
      )

      return [
        new BigNumber(bondedBalance),
        new BigNumber(primaryCollateralBalance),
      ]
    },
    [api, bondedTokenAddress, primaryCollateralAddress]
  )

  // watch for a connected user and get its balances
  useEffect(() => {
    const fetchUserBalances = async connectedUser => {
      const [bondedBalance, primaryCollateralBalance] = await getUserBalances(
        connectedUser
      )

      // TODO: keep an eye on React 17, since all updates will be batched by default
      batchedUpdates(() => {
        setUserBondedTokenBalance(bondedBalance)
        setUserPrimaryCollateralBalance(primaryCollateralBalance)
      })
    }
    if (connectedUser) {
      fetchUserBalances(connectedUser)
    }
  }, [connectedUser, getUserBalances])

  // polls the balances and price
  useInterval(async () => {
    // polling balances
    const primaryCollateralPromise = api
      .call('balanceOf', pool, primaryCollateralAddress)
      .toPromise()
    const primaryCollateralBalance = await Promise.all([
      primaryCollateralPromise,
    ])

    const newReserveBalance = new BigNumber(primaryCollateralBalance)
    const newPrimaryCollateralBalance = new BigNumber(
      primaryCollateralBalance
    ).plus(primaryCollateralVirtualBalance)
    // poling user balances
    let newUserBondedTokenBalance, newUserPrimaryCollateralBalance
    if (connectedUser) {
      const userBalances = await getUserBalances(connectedUser)
      newUserBondedTokenBalance = userBalances[0]
      newUserPrimaryCollateralBalance = userBalances[1]
    }
    // polling price
    const price = await marketMakerContract
      .getStaticPricePPM(
        primaryCollateralSupply.toFixed(),
        polledPrimaryCollateralBalance.toFixed(),
        reserveRatio.toFixed()
      )
      .toPromise()
    const newPrice = new BigNumber(price).div(PPM)
    // TODO: keep an eye on React 17, since all updates will be batched by default
    // see: https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
    // until then, it's safe to use the unstable API
    batchedUpdates(() => {
      // update the state only if value changed
      if (!newReserveBalance.eq(polledReserveBalance))
        setPolledReserveBalance(newReserveBalance)
      if (!newPrimaryCollateralBalance.eq(polledPrimaryCollateralBalance))
        setPolledPrimaryCollateralBalance(newPrimaryCollateralBalance)
      if (!newPrice.eq(polledPrice)) setPolledPrice(newPrice)
      // update user balances
      if (connectedUser) {
        if (!newUserBondedTokenBalance.eq(userBondedTokenBalance))
          setUserBondedTokenBalance(newUserBondedTokenBalance)
        if (!newUserPrimaryCollateralBalance.eq(userPrimaryCollateralBalance))
          setUserPrimaryCollateralBalance(newUserPrimaryCollateralBalance)
      }
    })
  }, Polling.DURATION)

  // *****************************
  // identity handlers
  // *****************************
  const handleResolveLocalIdentity = address => {
    return api.resolveAddressIdentity(address).toPromise()
  }
  const handleShowLocalIdentityModal = address => {
    return api.requestAddressIdentityModification(address).toPromise()
  }

  return (
    <IdentityProvider
      onResolve={handleResolveLocalIdentity}
      onShowLocalIdentityModal={handleShowLocalIdentityModal}
    >
      <MainViewContext.Provider value={context}>
        <Header
          primary="Marketplace"
          secondary={
            layoutName === 'small' ? (
              <ContextMenu>
                <ContextMenuItem
                  disabled={polledPrice === 0}
                  onClick={() => setOrderPanel(true)}
                >
                  New Order
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleWithdraw()}>
                  Withdraw
                </ContextMenuItem>
              </ContextMenu>
            ) : (
              <>
                <Button
                  disabled={polledPrice === 0}
                  mode="strong"
                  label="New Order"
                  css="margin-left: 20px;"
                  onClick={() => setOrderPanel(true)}
                >
                  New Order
                </Button>
              </>
            )
          }
        />
        <Tabs selected={tabIndex} onChange={setTabindex} items={tabs} />
        {tabIndex === 0 && <Overview />}
        {tabIndex === 1 && <Orders />}
        {tabIndex === 2 && <Orders myOrders />}
        {tabIndex === 3 && <Reserves />}
        <NewOrder />
      </MainViewContext.Provider>
    </IdentityProvider>
  )
}

import BigNumber from 'bignumber.js'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Polling } from '../constants'
import { useInterval } from '../hooks/useInterval'
import useActions from '../hooks/useActions'
import { useContributorSubscription } from '../hooks/useSubscriptions'
import { useWallet } from './Wallet'

const UserStateContext = createContext()

export const UserStateProvider = ({ children }) => {
  const { account } = useWallet()
  const {
    getContributionTokenBalance,
    getAllowedContributionAmount,
    getAwardedTokensAmount,
  } = useActions()
  const [collateralBalance, setCollateralBalance] = useState(new BigNumber(0))
  const [allowedContributionAmount, setAllowedContributionAmount] = useState(
    new BigNumber(0)
  )
  const [awardedTokenAmount, setAwardedTokenAmount] = useState(new BigNumber(0))
  const [loadingTokenData, setLoadingTokenData] = useState(true)
  const [contributorData, loadingContributor] = useContributorSubscription(
    account
  )
  const loading = loadingContributor || loadingTokenData

  const setEmptyTokenData = () => {
    setCollateralBalance(new BigNumber(0))
    setAllowedContributionAmount(new BigNumber(0))
    setAwardedTokenAmount(new BigNumber(0))
  }

  const getUserTokenData = useCallback(
    account =>
      Promise.all([
        getContributionTokenBalance(account),
        getAllowedContributionAmount(account),
        getAwardedTokensAmount(account),
      ]),
    [
      getContributionTokenBalance,
      getAllowedContributionAmount,
      getAwardedTokensAmount,
    ]
  )

  // watch for a connected user and get its token data.
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!account) {
        setEmptyTokenData()
        return
      }

      setLoadingTokenData(true)

      try {
        const [
          collateralAmount,
          allowedAmount,
          awardedAmount,
        ] = await getUserTokenData(account)
        setCollateralBalance(collateralAmount)
        setAllowedContributionAmount(allowedAmount)
        setAwardedTokenAmount(awardedAmount)

        setLoadingTokenData(false)
      } catch (err) {
        setLoadingTokenData(false)
      }
    }

    fetchTokenData()

    return () => {}
  }, [account, getUserTokenData])

  // polls token data
  useInterval(async () => {
    if (!account) {
      return
    }

    try {
      const [
        newCollateralBalance,
        newAllowedContributionAmount,
        newAwardedTokenAmount,
      ] = await getUserTokenData(account)

      if (!newCollateralBalance.eq(collateralBalance)) {
        setCollateralBalance(newCollateralBalance)
      }
      if (!newAllowedContributionAmount.eq(allowedContributionAmount)) {
        setAllowedContributionAmount(newAllowedContributionAmount)
      }
      if (!newAwardedTokenAmount.eq(awardedTokenAmount)) {
        setAwardedTokenAmount(newAwardedTokenAmount)
      }

      setLoadingTokenData(false)
    } catch (err) {
      console.error('Error fetching user token data: ', err)
    }
  }, Polling.DURATION)

  const UserState = useMemo(
    () => ({
      account,
      contributorData,
      loading,
      collateralBalance,
      allowedContributionAmount,
      awardedTokenAmount,
    }),
    [
      account,
      contributorData,
      loading,
      collateralBalance,
      allowedContributionAmount,
      awardedTokenAmount,
    ]
  )
  return (
    <UserStateContext.Provider value={UserState}>
      {children}
    </UserStateContext.Provider>
  )
}

export const useUserState = () => {
  const context = useContext(UserStateContext)

  if (!context) {
    throw new Error('useUserState must be used within an UserStateProvider')
  }

  return context
}

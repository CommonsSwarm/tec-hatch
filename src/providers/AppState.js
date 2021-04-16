import React, { createContext, useContext } from 'react'
import useOrgData from '../hooks/useOrgData.js'
import usePanelState from '../hooks/usePanelState'

const AppStateContext = createContext()

export const AppStateProvider = ({ children }) => {
  const {
    config,
    errors,
    hatchConnector,
    hatchApp,
    redemptionsApp,
    organization,
    loadingAppData,
  } = useOrgData()
  const contributionPanel = usePanelState()
  const refundPanel = usePanelState()
  const redeemPanel = usePanelState()

  const appLoading = !errors && loadingAppData

  return (
    <AppStateContext.Provider
      value={{
        config,
        errors: { orgErrors: errors },
        hatchApp,
        redemptionsApp,
        organization,
        isLoading: appLoading,
        hatchConnector,
        contributionPanel,
        refundPanel,
        redeemPanel,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export const useAppState = () => {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }

  return context
}

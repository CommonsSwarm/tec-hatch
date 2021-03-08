import React, { createContext, useContext } from 'react'
import useOrgData from '../hooks/useOrgData.js'

const AppStateContext = createContext()

export const AppStateProvider = ({ children }) => {
  // test
  const {
    config,
    errors,
    hatchConnector,
    hatchApp,
    installedApps,
    organization,
    loadingAppData,
  } = useOrgData()

  const appLoading = !errors && loadingAppData

  return (
    <AppStateContext.Provider
      value={{
        config,
        errors: { orgErrors: errors },
        installedApps,
        hatchApp,
        organization,
        isLoading: appLoading,
        hatchConnector,
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

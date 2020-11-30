import React, { useContext, useMemo } from 'react'
import Web3 from 'web3'
import { UseWalletProvider, useWallet } from 'use-wallet'
import { getUseWalletConnectors } from '../utils/web3-utils'
import { getNetwork } from '../networks'

const WalletAugmentedContext = React.createContext()

const useWalletAugmented = () => {
  return useContext(WalletAugmentedContext)
}

// Adds Web3.js to the useWallet() object
const WalletAugmented = ({ children }) => {
  const wallet = useWallet()
  const { ethereum } = wallet

  const web3 = useMemo(() => {
    if (ethereum) {
      return new Web3(ethereum)
    }
    return null
  }, [ethereum])

  const contextValue = useMemo(() => ({ ...wallet, web3 }), [wallet, web3])

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

const WalletProvider = ({ children }) => {
  const { chainId } = getNetwork()

  const connectors = getUseWalletConnectors()
  return (
    <UseWalletProvider chainId={chainId} connectors={connectors}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}

export { useWalletAugmented as useWallet, WalletProvider }

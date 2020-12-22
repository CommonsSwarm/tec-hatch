import { useMemo } from 'react'
import Web3 from 'web3'
import { getNetwork } from '../networks'
import { useWallet } from '../providers/Wallet'

const contractsCache = new Map()

export const useContract = (address, abi, readOnly = false) => {
  const { web3: walletWeb3 } = useWallet()
  const { defaultEthNode } = getNetwork()

  // TODO: See if this works
  const defaultWeb3 = useMemo(() => new Web3(defaultEthNode), [defaultEthNode])

  const web3 = readOnly ? defaultWeb3 : walletWeb3

  if (!address || !web3) {
    return
  }

  if (contractsCache.has(address)) {
    return contractsCache.get(address)
  }

  const contract = new web3.eth.Contract(abi, address)

  contractsCache.set(address, contract)

  return contract
}

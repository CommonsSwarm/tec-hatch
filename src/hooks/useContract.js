import { useWallet } from '../providers/Wallet'

const contractsCache = new Map()

export const useContract = (address, abi, signer = true) => {
  const { web3 } = useWallet()

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

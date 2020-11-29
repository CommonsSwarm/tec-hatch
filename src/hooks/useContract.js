import { Contract as EthersContract, providers as Providers } from 'ethers'
import { useMemo } from 'react'
import { getNetwork } from '../networks'
import { useWallet } from '../providers/Wallet'

const contractsCache = new Map()

// export const useContractReadOnly = (address, abi) => {
//   const ethEndpoint = getNetwork().defaultEthNode

//   const ethProvider = useMemo(
//     () => (ethEndpoint ? new Providers.JsonRpcProvider(ethEndpoint) : null),
//     [ethEndpoint]
//   )

//   return useMemo(() => {
//     if (!address) {
//       return null
//     }
//     return new EthersContract(address, abi, ethProvider)
//   }, [abi, address, ethProvider])
// }

export const useContract = (address, abi, signer = true) => {
  const { ethers } = useWallet()

  if (!address || !ethers) {
    return
  }

  if (contractsCache.has(address)) {
    return contractsCache.get(address)
  }

  const contract = new EthersContract(
    address,
    abi,
    signer ? ethers.getSigner() : ethers
  )

  contractsCache.set(address, contract)

  return contract
}

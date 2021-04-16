import {
  Contract as EthersContract,
  providers as EthersProviders,
} from 'ethers'
import { useMemo } from 'react'
import { getNetwork } from '../networks'
import { useWallet } from '../providers/Wallet'

const ethEndpoint = getNetwork().defaultEthNode
const DEFAULT_PROVIDER = new EthersProviders.JsonRpcProvider(ethEndpoint)

export const useContract = (address, abi, signer) => {
  const { account } = useWallet()

  return useMemo(() => {
    if (!address || !signer || !account) {
      return null
    }
    return new EthersContract(address, abi, signer ?? DEFAULT_PROVIDER)
  }, [account, address, abi, signer])
}

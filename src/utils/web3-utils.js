import { toChecksumAddress } from 'web3-utils'
import { secondsToMilliseconds } from './date-utils'

export const addressesEqual = (first, second) => {
  first = first && toChecksumAddress(first)
  second = second && toChecksumAddress(second)
  return first === second
}

export const getUseWalletProviders = () => {
  const providers = [{ id: 'injected' }, { id: 'frame' }]
  // Add other providers here

  return providers
}

export const getUseWalletConnectors = () => {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf
    }
    return connectors
  }, {})
}

export const timestampToDate = timestamp => {
  return new Date(secondsToMilliseconds(timestamp))
}

export { toHex, toChecksumAddress } from 'web3-utils'

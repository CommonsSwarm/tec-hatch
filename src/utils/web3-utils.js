import { toChecksumAddress } from 'web3-utils'

export const addressesEqual = (first, second) => {
  first = first && toChecksumAddress(first)
  second = second && toChecksumAddress(second)
  return first === second
}

export const getUseWalletProviders = () => {
  const providers = [{ id: 'injected' }]

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

export const timestampToMilliseconds = timestamp => {
  return timestamp * 1000
}

export const timestampToDate = timestamp => {
  return new Date(timestampToMilliseconds(timestamp))
}

export { toHex } from 'web3-utils'

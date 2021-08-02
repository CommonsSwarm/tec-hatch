import React, { useMemo } from 'react'
import { Connect } from '@1hive/connect-react'
import { providers } from 'ethers'
import { getNetwork } from '../networks'

const ConnectProvider = ({ children }) => {
  const {
    chainId,
    defaultEthNode,
    org: { address: orgAddress, connectorType },
  } = getNetwork()

  const provider = useMemo(
    () => new providers.JsonRpcProvider(defaultEthNode, chainId),
    [chainId, defaultEthNode]
  )

  return (
    <Connect
      location={orgAddress}
      connector={connectorType}
      options={{
        network: chainId,
        ethereum: provider,
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }

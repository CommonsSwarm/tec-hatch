import React from 'react'
import { Connect } from '@1hive/connect-react'
import { getNetwork } from '../networks'

const ConnectProvider = ({ children }) => {
  const {
    chainId,
    org: { address: orgAddress, connectorType },
  } = getNetwork()

  return (
    <Connect
      location={orgAddress}
      connector={connectorType}
      options={{
        network: chainId,
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }

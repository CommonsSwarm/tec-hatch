import React from 'react'
import { SidePanel } from '@commonsswarm/ui'
import Redeem from './Redeem'
import { useAppState } from '../../../providers/AppState'

export default () => {
  const {
    redeemPanel: { visible, requestClose },
  } = useAppState()

  return (
    <SidePanel title="Redeem Tokens" opened={visible} onClose={requestClose}>
      <Redeem />
    </SidePanel>
  )
}

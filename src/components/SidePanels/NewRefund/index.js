import React from 'react'
import { SidePanel } from '@commonsswarm/ui'
import Refund from './Refund'
import { useAppState } from '../../../providers/AppState'

export default () => {
  const {
    refundPanel: { visible, requestClose },
  } = useAppState()

  return (
    <SidePanel
      title="Refund Hatch Tokens"
      opened={visible}
      onClose={() => requestClose(false)}
    >
      <Refund />
    </SidePanel>
  )
}

import React from 'react'
import { SidePanel } from '@tecommons/ui'
import Contribution from './Contribution'
import { useAppState } from '../../providers/AppState'

export default () => {
  const {
    contributionPanel: { visible, requestClose },
  } = useAppState()

  return (
    <SidePanel title="New Contribution" opened={visible} onClose={requestClose}>
      <Contribution />
    </SidePanel>
  )
}

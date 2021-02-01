import React, { useContext } from 'react'
import { SidePanel } from '@tecommons/ui'
import { PresaleViewContext } from '../../context'
import Refund from './Refund'

export default () => {
  // *****************************
  // context state
  // *****************************
  const { refundPanel, setRefundPanel } = useContext(PresaleViewContext)

  return (
    <SidePanel
      title="Refund Hatch Shares"
      opened={refundPanel}
      onClose={() => setRefundPanel(false)}
    >
      <Refund />
    </SidePanel>
  )
}

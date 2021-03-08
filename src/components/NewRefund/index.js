import React, { useContext } from 'react'
import { SidePanel } from '@tecommons/ui'
import { HatchViewContext } from '../../context'
import Refund from './Refund'

export default () => {
  // *****************************
  // context state
  // *****************************
  const { refundPanel, setRefundPanel } = useContext(HatchViewContext)

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

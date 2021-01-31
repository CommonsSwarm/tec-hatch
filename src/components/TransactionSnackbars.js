import React from 'react'
import { IconCheck, IconCross, IconClock, GU } from '@aragon/ui'

const BaseSnackbar = ({ icon, message }) => (
  <span
    css={`
      display: flex;
      align-items: flex-end;
    `}
  >
    {icon}
    <span
      css={`
        margin-left: ${GU}px;
      `}
    >
      {message}
    </span>
  </span>
)

export const PendingSnackbar = () => (
  <BaseSnackbar icon={<IconClock />} message="Transaction being mined..." />
)

export const ConfirmedSnackbar = () => (
  <BaseSnackbar icon={<IconCheck />} message="Transaction Confirmed!" />
)

export const ErrorSnackbar = ({ userRejected }) => (
  <BaseSnackbar
    icon={<IconCross />}
    message={
      userRejected ? 'Transaction rejected by user' : 'Transaction Failed'
    }
  />
)

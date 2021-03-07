import React from 'react'
import { IconCheck, IconCross, IconClock, GU } from '@tecommons/ui'

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
  <BaseSnackbar
    icon={
      <IconClock
        css={`
          color: lightSkyBlue;
        `}
      />
    }
    message="Transaction being mined..."
  />
)

export const ConfirmedSnackbar = () => (
  <BaseSnackbar
    icon={
      <IconCheck
        css={`
          color: chartreuse;
        `}
      />
    }
    message="Transaction Confirmed!"
  />
)

export const ErrorSnackbar = ({ userRejected }) => (
  <BaseSnackbar
    icon={
      <IconCross
        css={`
          color: red;
        `}
      />
    }
    message={
      userRejected ? 'Transaction rejected by user' : 'Transaction Failed'
    }
  />
)

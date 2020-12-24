import React, { useCallback } from 'react'
import {
  Button,
  ButtonBase,
  GU,
  IconCheck,
  IconCopy,
  IdentityBadge,
  RADIUS,
  textStyle,
  useTheme,
} from '@tecommons/ui'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { getNetworkType } from '../../networks'
import { getProviderFromUseWalletId } from '../../ethereum-providers'

const AccountScreenConnected = ({ onClosePopover, wallet }) => {
  const theme = useTheme()
  const copy = useCopyToClipboard()

  const networkName = getNetworkType()
  const providerInfo = getProviderFromUseWalletId(wallet.activated)

  const handleCopyAddress = useCallback(() => copy(wallet.account), [
    copy,
    wallet,
  ])

  const handleDeactivate = useCallback(() => wallet.deactivate(), [wallet])

  return (
    <div
      css={`
        padding: ${2 * GU}px;
      `}
    >
      <div
        css={`
          padding-top: ${2 * GU}px;
        `}
      >
        <h4
          css={`
            ${textStyle('label2')};
            color: ${theme.contentSecondary};
            margin-bottom: ${2 * GU}px;
          `}
        >
          Active Wallet
        </h4>
        <div
          css={`
            display: flex;
            align-items: center;
            width: 100%;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              margin-right: ${3 * GU}px;
            `}
          >
            <img
              src={providerInfo.image}
              alt=""
              css={`
                width: ${2.5 * GU}px;
                height: ${2.5 * GU}px;
                margin-right: ${0.5 * GU}px;
                transform: translateY(-2px);
              `}
            />
            <span>
              {providerInfo.id === 'unknown' ? 'Wallet' : providerInfo.name}
            </span>
          </div>
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: flex-end;
              width: 100%;
            `}
          >
            <ButtonBase
              onClick={handleCopyAddress}
              focusRingRadius={RADIUS}
              css={`
                display: flex;
                align-items: center;
                justify-self: flex-end;
                padding: ${0.5 * GU}px;
                &:active {
                  background: ${theme.surfacePressed};
                }
              `}
            >
              <IdentityBadge
                entity={wallet.account}
                compact
                badgeOnly
                css="cursor: pointer"
              />
              <IconCopy
                css={`
                  color: ${theme.hint};
                `}
              />
            </ButtonBase>
          </div>
        </div>
        <div
          css={`
            padding: ${2 * GU}px 0;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              color: ${theme.positive};
              ${textStyle('label2')};
            `}
          >
            <IconCheck size="small" css={
              `color: ${theme.green};
            `}/>
            <span
              css={`
                margin-left: ${0.5 * GU}px;
                color: ${theme.green}
              `}
            >
              {`Connected to ${networkName} Network`}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleDeactivate}
        wide
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        Disconnect wallet
      </Button>
    </div>
  )
}

export default AccountScreenConnected

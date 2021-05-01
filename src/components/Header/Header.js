import React from 'react'
import { GU, Link, useTheme, useViewport } from '@commonsswarm/ui'
import AccountModule from '../Account/AccountModule'
import { useWallet } from '../../providers/Wallet'
import TECLogo from '../../assets/TECLogo.png'
import TECName from '../../assets/TECName.svg'

const HEADER_HEIGHT = 13 * GU
const Header = () => {
  const theme = useTheme()
  const { account } = useWallet()
  const { below } = useViewport()
  const layoutSmall = below('medium')

  return (
    <header
      css={`
        position: relative;
        z-index: 3;
        background: ${theme.surfaceContentAuxiliar};
        box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
      `}
    >
      <div
        css={`
          height: ${HEADER_HEIGHT}px;
          margin-right: ${3 * GU}px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <Link href="#/home" external={false}>
            <img
              src={TECLogo}
              height={HEADER_HEIGHT + 5}
              width={130}
              alt="TEC logo"
            />
          </Link>
          <img
            src={TECName}
            alt="TEC name"
            css={`
              margin-left: ${3 * GU}px;
            `}
          />
          {!below('large') && (
            <nav
              css={`
                display: flex;
                align-items: center;

                height: 100%;
                margin-left: ${6.5 * GU}px;
              `}
            />
          )}
        </div>

        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <AccountModule compact={layoutSmall} />
          {account && !layoutSmall && (
            <>
              <div
                css={`
                  width: 0.5px;
                  border-left: 0.5px solid ${theme.border};
                `}
              />
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

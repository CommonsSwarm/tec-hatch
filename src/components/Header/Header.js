import React from 'react'
import { GU, Link, useTheme, useViewport } from '@aragon/ui'
import AccountModule from '../Account/AccountModule'
import { useWallet } from '../../providers/Wallet'
import TECommonsLogo from '../../assets/TECommonsLogo.png'

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
        background: #1d212b;
        box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
      `}
    >
      <div
        css={`
          height: ${8 * GU}px;
          margin: 0 ${3 * GU}px;
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
            <img src={TECommonsLogo} height={layoutSmall ? 40 : 60} alt="" />
          </Link>
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
                  height: ${3.5 * GU}px;
                  border-left: 0.5px solid ${theme.border};
                `}
              />
              {/* <BalanceModule /> */}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

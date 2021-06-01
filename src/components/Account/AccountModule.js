import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Button, GU, IconConnect, springs } from '@commonsswarm/ui'
import { Transition, animated } from 'react-spring/renderprops'

import ScreenError from './ScreenError'
import AccountButton from './AccountButton'
import ScreenProviders from './ScreenProviders'
import ScreenConnected from './ScreenConnected'
import ScreenPromptingAction from './ScreenPromptingAction'
import HeaderPopover from '../Header/HeaderPopover'

import { useAppState } from '../../providers/AppState'

import { getUseWalletProviders } from '../../utils/web3-utils'
import { useTheme } from 'styled-components'
import { addEthereumChain, getNetwork } from '../../networks'

import {
  getProviderFromUseWalletId,
  getProviderString,
} from '../../ethereum-providers'

const AnimatedDiv = animated.div

const SCREENS = [
  {
    id: 'providers',
    height:
      6 * GU + // header
      (12 + 1.5) * GU * Math.ceil(getUseWalletProviders().length / 2) + // buttons
      7 * GU, // footer
  },
  {
    id: 'connecting-network',
    height: 38 * GU,
  },
  {
    id: 'connecting',
    height: 38 * GU,
  },
  {
    id: 'connected',
    height: 32.5 * GU,
  },
  {
    id: 'error',
    height: 50 * GU,
  },
]

const AccountModule = ({ compact }) => {
  const theme = useTheme()
  const buttonRef = useRef()
  const wallet = useWallet()
  const [opened, setOpened] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(false)
  const [creatingNetwork, setCreatingNetwork] = useState(false)
  const [activationError, setActivationError] = useState(null)
  const popoverFocusElement = useRef()

  const { account, activating } = wallet
  const { isLoading } = useAppState()
  const network = getNetwork()
  const provider = getProviderFromUseWalletId(activating)

  const clearError = useCallback(() => setActivationError(null), [])

  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const getPromptingActionDescription = screenId => {
    switch (screenId) {
      case 'connecting-network':
        return {
          actionTitle: `Connecting to ${network.name} network`,
          actionDescription: `Create the ${network.name} network in Metamask and switch to it. You may be temporarily redirected to a new screen.`,
        }
      case 'connecting':
        return {
          actionTitle: `Connecting to ${getProviderString(
            'your Ethereum provider',
            provider.id
          )}`,
          actionDescription: `Log into ${getProviderString(
            'your Ethereum provider',
            provider.id
          )}. You may be temporarily redirected to a new screen.`,
        }
      default: {
        return { actionTitle: 'Performing action' }
      }
    }
  }

  useEffect(() => {
    if (account) {
      setOpened(false)
    }
  }, [account])

  const handleCancelConnection = useCallback(() => {
    wallet.deactivate()
  }, [wallet])

  const activate = useCallback(
    async providerId => {
      try {
        setCreatingNetwork(true)
        await addEthereumChain()
        setCreatingNetwork(false)
        await wallet.activate(providerId)
      } catch (error) {
        setActivationError(error)
        setCreatingNetwork(false)
      }
    },
    [wallet]
  )

  // Don’t animate the slider until the popover has opened
  useEffect(() => {
    if (!opened) {
      return
    }
    setAnimate(false)
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [opened])

  // Always show the “connecting…” screen, even if there are no delay
  useEffect(() => {
    if (activationError) {
      setActivatingDelayed(null)
    }

    if (activating) {
      setActivatingDelayed(activating)
      return
    }

    const timer = setTimeout(() => {
      setActivatingDelayed(null)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [activating, activationError])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId = (() => {
      if (activationError) return 'error'
      if (activatingDelayed) return 'connecting'
      if (creatingNetwork) return 'connecting-network'
      if (account) return 'connected'
      return 'providers'
    })()

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [account, activationError, activatingDelayed, creatingNetwork])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const { actionTitle, actionDescription } = getPromptingActionDescription(
    screenId
  )

  const handlePopoverClose = useCallback(
    reject => {
      if (
        screenId === 'connecting' ||
        screenId === 'error' ||
        screenId === 'connecting-network'
      ) {
        // reject closing the popover
        return false
      }
      setOpened(false)
      setActivationError(null)
    },
    [screenId]
  )

  // Prevents to lose the focus on the popover when a screen leaves while an
  // element inside is focused (e.g. when clicking on the “disconnect” button).
  useEffect(() => {
    if (popoverFocusElement.current) {
      popoverFocusElement.current.focus()
    }
  }, [screenId])

  return (
    <div
      ref={buttonRef}
      tabIndex="0"
      css={`
        display: flex;
        align-items: center;
        justify-content: space-around;
        outline: 0;
        background: ${theme.background};
      `}
    >
      {screen.id === 'connected' ? (
        <AccountButton onClick={toggle} />
      ) : (
        <Button
          icon={<IconConnect />}
          label="Enable account"
          onClick={toggle}
          display={compact ? 'icon' : 'all'}
          disabled={isLoading}
        />
      )}

      <HeaderPopover
        animateHeight={animate}
        heading={screen.title}
        height={screen.height}
        width={41 * GU}
        onClose={handlePopoverClose}
        opener={buttonRef.current}
        visible={opened}
      >
        <div ref={popoverFocusElement} tabIndex="0" css="outline: 0">
          <Transition
            native
            immediate={!animate}
            config={springs.smooth}
            items={{
              screen,
              // This is needed because use-wallet throws an error when the
              // activation fails before React updates the state of `activating`.
              // A future version of use-wallet might return an
              // `activationError` object instead, making this unnecessary.
              activating: screen.id === 'error' ? null : activatingDelayed,
              wallet,
            }}
            keys={({ screen }) => screen.id + activatingDelayed}
            from={{
              opacity: 0,
              transform: `translate3d(${3 * GU * direction}px, 0, 0)`,
            }}
            enter={{ opacity: 1, transform: `translate3d(0, 0, 0)` }}
            leave={{
              opacity: 0,
              transform: `translate3d(${3 * GU * -direction}px, 0, 0)`,
            }}
          >
            {({ screen, activating, wallet }) => ({ opacity, transform }) => (
              <AnimatedDiv
                style={{ opacity, transform }}
                css={`
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                `}
              >
                {(() => {
                  if (screen.id === 'connecting-network') {
                    return (
                      <ScreenPromptingAction
                        actionTitle={actionTitle}
                        actionDescription={actionDescription}
                        logo={network.image}
                      />
                    )
                  }
                  if (screen.id === 'connecting') {
                    return (
                      <ScreenPromptingAction
                        actionTitle={actionTitle}
                        actionDescription={actionDescription}
                        logo={provider.image}
                        onCancel={handleCancelConnection}
                      />
                    )
                  }
                  if (screen.id === 'connected') {
                    return (
                      <ScreenConnected
                        onClosePopover={toggle}
                        wallet={wallet}
                      />
                    )
                  }
                  if (screen.id === 'error') {
                    return (
                      <ScreenError
                        error={activationError}
                        onBack={clearError}
                      />
                    )
                  }
                  return <ScreenProviders onActivate={activate} />
                })()}
              </AnimatedDiv>
            )}
          </Transition>
        </div>
      </HeaderPopover>
    </div>
  )
}

export default AccountModule

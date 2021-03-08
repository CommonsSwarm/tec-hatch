import React from 'react'
import { Main, ToastHub } from '@tecommons/ui'
import { WalletProvider } from './providers/Wallet'
import { ConnectProvider as Connect } from './providers/Connect'

import MainView from './components/MainView'

import './assets/global.css'
import { AppStateProvider } from './providers/AppState'
import HatchView from './views/HatchView'

export default () => {
  return (
    <WalletProvider>
      <Connect>
        <AppStateProvider>
          <Main theme="dark" assetsUrl="/aragon-ui" layout={false}>
            <ToastHub>
              <MainView>
                <HatchView />
              </MainView>
            </ToastHub>
          </Main>
        </AppStateProvider>
      </Connect>
    </WalletProvider>
  )
}

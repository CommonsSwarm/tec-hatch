import React from 'react'
import { Main } from '@tecommons/ui'
import { WalletProvider } from './providers/Wallet'
import { ConnectProvider as Connect } from './providers/Connect'

import MainView from './components/MainView'

import './assets/global.css'
import { AppStateProvider } from './providers/AppState'
import PresaleView from './views/PresaleView'

export default () => {
  return (
    <WalletProvider>
      <Connect>
        <AppStateProvider>
          <Main theme="dark" assetsUrl="/aragon-ui/" layout={false}>
            <MainView>
              <PresaleView />
            </MainView>
          </Main>
        </AppStateProvider>
      </Connect>
    </WalletProvider>
  )
}

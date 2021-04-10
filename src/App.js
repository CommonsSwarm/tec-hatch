import React from 'react'
import { Main, ToastHub } from '@tecommons/ui'
import { WalletProvider } from './providers/Wallet'
import { AppStateProvider } from './providers/AppState'
import { UserStateProvider } from './providers/UserState'
import { ConnectProvider as Connect } from './providers/Connect'

import MainView from './components/MainView'
import Hatch from './screens/Hatch'

import './assets/global.css'

export default () => {
  return (
    <WalletProvider>
      <Connect>
        <AppStateProvider>
          <UserStateProvider>
            <Main
              theme="dark"
              assetsUrl="/aragon-ui"
              layout={false}
              scrollView={false}
            >
              <ToastHub>
                <MainView>
                  <Hatch />
                </MainView>
              </ToastHub>
            </Main>
          </UserStateProvider>
        </AppStateProvider>
      </Connect>
    </WalletProvider>
  )
}

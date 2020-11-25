import React from 'react'
import { AragonApi, useAppState, useGuiStyle } from '@aragon/api-react'
import { Main, SyncIndicator } from '@aragon/ui'
import appStateReducer from './appStateReducer'
import PresaleView from './views/PresaleView'

import './assets/global.css'

const App = () => {
  // *****************************
  // background script state
  // *****************************
  const { isReady  } = useAppState()

  // *****************************
  // aragon api
  // *****************************
  const { appearance } = useGuiStyle()

  return (
    <Main theme={appearance} assetsUrl="./aragon-ui">
      <SyncIndicator visible={!isReady} />
      {isReady && <PresaleView />}
    </Main>
  )
}

export default () => (
  <AragonApi reducer={appStateReducer}>
    <App />
  </AragonApi>
)

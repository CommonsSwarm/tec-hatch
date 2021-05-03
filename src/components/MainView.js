import React from 'react'
import { ScrollView, SyncIndicator, Layout, useTheme } from '@commonsswarm/ui'
import { ThemeProvider as SCThemeProvider } from 'styled-components'

import Header from './Header/Header'

import { useAppState } from '../providers/AppState'
import ErrorModal from './ErrorModal'

const MainView = ({ children }) => {
  const theme = useTheme()
  const { isLoading, errors } = useAppState()

  return (
    <SCThemeProvider theme={theme}>
      <ScrollView>
        <div
          css={`
            display: flex;
            flex-direction: column;
            height: 100vh;
          `}
        >
          <div
            css={`
              flex-shrink: 0;
            `}
          >
            <Header />
          </div>
          <Layout>
            <SyncIndicator visible={isLoading} />
            <Layout>{!isLoading && children}</Layout>
            <ErrorModal visible={!!errors} />
          </Layout>
        </div>
      </ScrollView>
    </SCThemeProvider>
  )
}

export default MainView

import React from 'react'
import { ScrollView, SyncIndicator, Layout } from '@tecommons/ui'

import Header from './Header/Header'
import { useAppState } from '../providers/AppState'

const MainView = ({ children }) => {
  const { isLoading } = useAppState()

  return (
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
        <ScrollView>
          <SyncIndicator visible={isLoading} />
          <Layout>{!isLoading && children}</Layout>
        </ScrollView>
      </Layout>
    </div>
  )
}

export default MainView

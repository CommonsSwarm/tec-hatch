import React from 'react'
import { ScrollView, SyncIndicator, Layout } from '@commonsswarm/ui'
import Header from './Header/Header'
import { useAppState } from '../providers/AppState'

const MainView = ({ children }) => {
  const { isLoading } = useAppState()

  return (
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
        </Layout>
      </div>
    </ScrollView>
  )
}

export default MainView

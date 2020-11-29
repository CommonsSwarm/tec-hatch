import React from 'react'
import { ScrollView, SyncIndicator, useViewport, Layout } from '@aragon/ui'
import { useAppLogic } from '../hooks/useAppLogic'

import Header from './Header/Header'

const MainView = ({ children }) => {
  const { isLoading } = useAppLogic()
  const { below } = useViewport()
  // const layoutSmall = below('medium')

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

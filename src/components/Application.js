import React, { useContext, useEffect } from 'react'

import Contract from './common/contract/Contract'
import Layout from './common/layout/Layout'
import { AppContext } from './reducer/App'
import { getConfig, getSchema } from './utils/Api'

function Application() {
  const { dispatch } = useContext(AppContext)

  useEffect(() => {
    getSchema('/api.json').then(json => {
      const config = getConfig(json)
      dispatch({
        type: 'COMPLETE',
        payload: { config },
      })
    })
  }, [dispatch])

  return (
    <Layout>
      <Contract />
    </Layout>
  )
}

export default Application

import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ToastContainer } from 'react-toastify'
import { render } from 'react-dom'

import Application from './components/Application'
import MuiTheme from './components/utils/Theme'
import { AppProvider } from './components/reducer/App'
import { ContractProvider } from './components/reducer/Contract'

render(
  <MuiThemeProvider theme={MuiTheme}>
    <AppProvider>
      <ContractProvider>
        <ToastContainer position='top-center' hideProgressBar />
        <Application />
      </ContractProvider>
    </AppProvider>
  </MuiThemeProvider>,
  document.getElementById('app')
)

import PropTypes from 'prop-types'
import get from 'lodash.get'
import React, { useReducer } from 'react'

const defaultAppContext = {
  select: '',
  tab: 'builder',
  config: {},
}

function reducer(state, action) {
  switch (action.type) {
    case 'APP_SELECT':
    case 'TAB_SELECT':
    case 'COMPLETE': {
      return { ...state, ...get(action, 'payload') }
    }
    default:
      return state
  }
}

export const AppContext = React.createContext({ ...defaultAppContext })

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { ...defaultAppContext })
  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

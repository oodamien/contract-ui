import PropTypes from 'prop-types'
import get from 'lodash.get'
import set from 'lodash.set'
import unset from 'lodash.unset'
import yaml from 'js-yaml'
import React, { useReducer } from 'react'

import schema from '../../../dev/api.json'

function reducerHistory(currentHistory, newPresent) {
  const { present, past } = currentHistory
  if (present === newPresent) {
    return currentHistory
  }
  return {
    past: [...past, present],
    present: newPresent,
    future: [],
  }
}

function reduceContract(contract) {
  let isValid = true
  let json = null
  if (contract) {
    try {
      json = yaml.load(contract)
    } catch (e) {
      isValid = false
    }
  }
  return {
    isValid,
    json,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'CONTRACT_CREATE': {
      const reduce = reduceContract(get(action, 'payload.contract', ''))
      const contracts = [
        ...state.contracts,
        {
          filename: get(action, 'payload.filename', ''),
          contract: get(action, 'payload.contract', ''),
          isValid: reduce.isValid,
          json: reduce.json,
          history: {
            past: [],
            present: null,
            future: [],
          },
          extention: get(action, 'payload.extention', '.yml'),
        },
      ]
      return { contracts }
    }
    case 'CONTRACT_DELETE': {
      const contracts = [
        ...state.contracts.filter(
          contract => contract.filename !== get(action, 'payload.filename')
        ),
      ]
      return { contracts }
    }
    case 'CONTRACT_UPDATE': {
      const contracts = [...state.contracts]
      const newContract = get(action, 'payload.contract')
      const target = contracts.find(
        contract => contract.filename === get(action, 'payload.filename')
      )
      const reduce = reduceContract(newContract)
      target.history = reducerHistory(target.history, newContract)
      target.contract = newContract
      target.json = reduce.json
      target.isValid = reduce.isValid
      return { contracts }
    }
    case 'CONTRACT_UPDATE_FILENAME': {
      const contracts = [...state.contracts]
      const target = contracts.find(
        contract => contract.filename === get(action, 'payload.filename')
      )
      target.filename = get(action, 'payload.newFilename')
      return { contracts }
    }

    case 'CONTRACT_UNDO': {
      const contracts = [...state.contracts]
      const target = contracts.find(
        contract => contract.filename === get(action, 'payload.filename')
      )
      const { past, future } = get(target, 'history')
      const previous = past[past.length - 1] || ''
      const newPast = past.slice(0, past.length - 1)
      target.history = {
        past: newPast,
        present: previous,
        future: [target.contract, ...future],
      }
      const reduce = reduceContract(previous)
      target.contract = previous
      target.json = reduce.json
      target.isValid = reduce.isValid
      return { contracts }
    }
    case 'CONTRACT_REDO': {
      const contracts = [...state.contracts]
      const target = contracts.find(
        contract => contract.filename === get(action, 'payload.filename')
      )
      const { past, future } = get(target, 'history')
      const next = future[0]
      const newFuture = future.slice(1)
      target.history = {
        past: [...past, target.contract],
        present: next,
        future: newFuture,
      }
      const reduce = reduceContract(next)
      target.contract = next
      target.json = reduce.json
      target.isValid = reduce.isValid
      return { contracts }
    }
    case 'CONTRACT_ADD_LINE': {
      const contracts = [...state.contracts]
      const target = contracts.find(
        contract => contract.filename === get(action, 'payload.filename')
      )

      const json = get(target, 'json', {})
      set(json, get(action, 'payload.line.key'), get(action, 'payload.value'))

      const newContract = yaml.safeDump(json)
      const reduce = reduceContract(newContract)
      target.history = reducerHistory(target.history, newContract)
      target.contract = newContract
      target.json = reduce.json
      target.isValid = reduce.isValid
      return { contracts }
    }
    case 'CONTRACT_DELETE_LINE': {
      const contracts = [...state.contracts]
      const target = contracts.find(
        contract => contract.filename === get(action, 'payload.filename')
      )
      const json = get(target, 'json', {})
      const key = get(action, 'payload.value')

      unset(json, key)

      const newContract = yaml.safeDump(json)
      const reduce = reduceContract(newContract)
      target.history = reducerHistory(target.history, newContract)
      target.contract = newContract
      target.json = reduce.json
      target.isValid = reduce.isValid
      return { contracts }
    }
    default:
      return state
  }
}

export const ContractContext = React.createContext({ contracts: [] })

export function ContractProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { contracts: [] })
  return (
    <ContractContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ContractContext.Provider>
  )
}

ContractProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

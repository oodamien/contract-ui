import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import get from 'lodash.get'
import React, { useContext, useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Edit from './Edit'
import { AppContext } from '../../../reducer/App'
import { ContractContext } from '../../../reducer/Contract'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      fontSize: '15px',
      '& .MuiButtonBase-root': {
        padding: '8px',
      },
    },
    box: {
      backgroundColor: '#f1f2f6',
      border: '1px solid #dfe0e2',
      // padding: theme.spacing(1),
      borderRadius: '3px',
      '&.level2': {
        background: '#fff',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
      '&.level1': {
        marginBottom: theme.spacing(1),
      },
    },
    line: {
      padding: theme.spacing(1) * 1.5,
      borderBottom: '1px solid #dfe0e2',
      position: 'relative',
      '&.level1': {
        borderBottom: '0 none',
      },
      '&.level2': {
        cursor: 'pointer',
        transition: 'all 0.15s',
        background: '#fff',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: '0 2px 4px rgba(0,0,0,.15)',
          zIndex: 2,
        },
      },
      '&:last-child': {
        borderBottom: '0 none',
      },
      '& .MuiButtonBase-root': {
        position: 'absolute',
        top: '50%',
        right: '3px',
        marginTop: '-19px',
      },
      '&.line-hover': {
        cursor: 'pointer',
        transition: 'all 0.15s',
        '&:hover': {
          background: '#fff',
          transform: 'scale(1.01)',
          boxShadow: '0 2px 4px rgba(0,0,0,.15)',
          zIndex: 2,
        },
      },
    },
    label: {
      display: 'inline-block',
      verticalAlign: 'top',
    },
    value: {
      display: 'inline-block',
      verticalAlign: 'top',
      margin: 0,
      marginLeft: '6px',
      padding: 0,
      fontFamily: theme.typography.fontFamily,
      fontWeight: 'bold',
    },
  })
)

export function isObject(value) {
  return (
    (typeof value === 'object' || typeof value === 'function') && value !== null
  )
}

function Line({ contract, id, label, value, level, onClick }) {
  const classes = useStyles()
  const { dispatch } = useContext(ContractContext)
  return (
    <div
      className={`${classes.line} level${level} ${value ? 'line-hover' : ''}`}
      onClick={onClick}
    >
      <span className={classes.label}>
        {label}
        {value ? ':' : ''}
      </span>
      {value && (
        <span>
          {isObject(value) ? (
            <pre className={classes.value}>
              {JSON.stringify(value, null, 2)}
            </pre>
          ) : (
            <pre className={classes.value}>{value}</pre>
          )}
        </span>
      )}
      <IconButton
        aria-label='delete'
        onClick={e => {
          e.stopPropagation()
          dispatch({
            type: 'CONTRACT_DELETE_LINE',
            payload: { filename: contract.filename, value: id },
          })
        }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  )
}

function recurseTransform(properties, json) {
  const result = []
  Object.keys(json).map(key => {
    const value = get(json, key)
    const valueIsObject =
      (typeof value === 'object' || typeof value === 'function') &&
      value !== null

    const item = properties.find(it => it.name === key)
    if (item) {
      if (valueIsObject && get(item, 'children', []).length > 0) {
        const child = recurseTransform(item.children, value)
        // result.push({ key, child })
        result.push(...child)
      } else {
        result.push({
          name: key,
          key: item.key,
          value,
        })
      }
    } else {
      console.log('TODO')
    }
    return key
  })

  return result
}

export default function View() {
  const classes = useStyles()
  const { contracts, dispatch } = useContext(ContractContext)
  const appContext = useContext(AppContext)
  const contract = contracts.find(c => c.filename === appContext.select)
  const [json, setJson] = useState('')
  const [select, setSelect] = useState(null)

  useEffect(() => {
    console.log('ici')
    setJson(contract.json)
  }, [contract, setJson, contracts])

  const { properties } = appContext.config
  const result = []

  Object.keys(json).map(key => {
    const value = get(json, key)
    const valueIsObject =
      (typeof value === 'object' || typeof value === 'function') &&
      value !== null

    const item = properties.find(it => it.key === key)

    if (item) {
      if (valueIsObject && item.children.length > 0) {
        const children = recurseTransform(item.children, value)
        result.push({ key, value: '', children })
      } else {
        result.push({
          name: key,
          key,
          value,
        })
      }
    } else {
      console.log('TODO')
    }

    return key
  })

  return (
    <div className={classes.root}>
      {result.map(item => {
        return (
          <div key={item.key} className={`${classes.box} level1`}>
            <Line
              label={item.key}
              key={`line-${item.key}`}
              value={item.value}
              contract={contract}
              id={item.key}
              level={1}
              onClick={() => {
                if (item.value) {
                  console.log(item)
                  setSelect(item)
                }
              }}
            />
            {get(item, 'children', []).length > 0 && (
              <div
                key={`children-${item.key}`}
                className={`${classes.box} level2`}
              >
                {item.children.map(line => (
                  <Line
                    key={line.key}
                    label={line.key}
                    value={line.value}
                    contract={contract}
                    id={line.key}
                    level={2}
                    onClick={() => {
                      console.log(line)
                      setSelect(line)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
      <Edit
        onClose={() => {
          setSelect(null)
        }}
        onValidate={value => {
          setSelect(null)
          dispatch({
            type: 'CONTRACT_LINE',
            payload: { filename: appContext.select, line: select, value },
          })
        }}
        item={select}
      />
    </div>
  )
}

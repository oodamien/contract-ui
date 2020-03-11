import get from 'lodash.get'
import React, { useContext, useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Line from './Line'
import Modal from './modal/Modal'
import { AppContext } from '../../../reducer/App'
import { ContractContext } from '../../../reducer/Contract'
import { jsonToTree } from '../../../utils/Api'

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
  })
)

export default function View() {
  const classes = useStyles()
  const { contracts, dispatch } = useContext(ContractContext)
  const appContext = useContext(AppContext)
  const contract = contracts.find(c => c.filename === appContext.select)
  const [json, setJson] = useState('')
  const [select, setSelect] = useState(null)

  useEffect(() => {
    setJson(contract.json)
  }, [contract, setJson, contracts])

  const { properties } = appContext.config
  const result = jsonToTree(json, properties)

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
                      setSelect(line)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
      <Modal
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

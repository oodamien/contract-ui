import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import clsx from 'clsx'
import get from 'lodash.get'
import React, { useContext, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Edit from './Edit'
import View from './View'
import useWindowDimensions from '../../../utils/WindowDimensions'
import { AppContext } from '../../../reducer/App'
import { ContractContext } from '../../../reducer/Contract'

function render(
  contract,
  item,
  level,
  classes,
  itemsClosed,
  setItemsClosed,
  setSelect
) {
  let closed = false
  const clazzLink = clsx(get(classes, `link${level}`), get(classes, `link`))
  const key = get(item, 'key')
  const clazz =
    level > 0
      ? clsx(get(classes, `collapse${level}`), get(classes, `special`))
      : get(classes, `collapse${level}`)
  if (!get(item, 'children')) {
    return (
      <ListItem
        className={clazzLink}
        button
        key={`li${key}`}
        onClick={() => {
          console.log(item.key)
          const value = get(contract, `json.${item.key}`, '')
          console.log(contract.JSON)
          setSelect({ ...item, value })
        }}
      >
        <ListItemText key={`it${key}`}>{item.name}</ListItemText>
      </ListItem>
    )
  }
  if (level === 0) {
    closed = !!itemsClosed.find(it => it === item.name)
  }
  return (
    <div key={`div${key}`}>
      <ListItem
        className={clazzLink}
        button
        key={`li${key}`}
        onClick={() => {
          if (level === 0) {
            if (closed) {
              setItemsClosed([...itemsClosed.filter(it => it !== item.name)])
            } else {
              setItemsClosed([...itemsClosed, item.name])
            }
          }
        }}
      >
        <ListItemText key={`it${key}`}>
          <strong key={`strong${key}`}>{item.name}</strong>
        </ListItemText>
        {level === 0 &&
          (closed ? (
            <ExpandLess key={`less${key}`} />
          ) : (
            <ExpandMore key={`more${key}`} />
          ))}
      </ListItem>
      <Collapse
        className={clazz}
        key={`collapse${key}`}
        in={!closed}
        timeout='auto'
        unmountOnExit
      >
        <List
          className={get(classes, `list${level}`)}
          key={`list${key}`}
          component='div'
          disablePadding
        >
          {get(item, 'children').map(child =>
            render(
              contract,
              child,
              level + 1,
              classes,
              itemsClosed,
              setItemsClosed,
              setSelect
            )
          )}
        </List>
      </Collapse>
    </div>
  )
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      position: 'fixed',
      right: 13,
      top: 108,
      bottom: 22,
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
    },
    divider: {
      position: 'fixed',
      top: 108,
      bottom: 22,
      right: 373,
      width: 1,
      background: '#dfe0e2',
    },
    special: {
      position: 'relative',
      '&::before': {
        display: 'block',
        content: '" "',
        position: 'absolute',
        top: 12,
        bottom: 8,
        left: 20,
        width: 5,
        background: '#f1f2f6',
        borderRadius: 3,
      },
    },
    collapse2: {
      '&::before': {
        left: 46,
      },
    },
    link: {
      padding: theme.spacing(1) / 3,
      paddingLeft: theme.spacing(2),
    },
    link0: {
      borderBottom: '1px solid #dfe0e2',
    },
    link2: {
      paddingLeft: theme.spacing(5),
    },
    link3: {
      paddingLeft: theme.spacing(8),
    },
    link4: {
      paddingLeft: theme.spacing(9),
    },
    container: {
      overflow: 'auto',
      position: 'relative',
      marginRight: 360,
    },
  })
)

export default function Builder() {
  const classes = useStyles()
  const { height } = useWindowDimensions()
  const { config, select: selectContract } = useContext(AppContext)
  const { contracts, dispatch } = useContext(ContractContext)
  const contract = contracts.find(c => c.filename === selectContract)
  const [itemsClosed, setItemsClosed] = useState([])
  const [select, setSelect] = useState(null)
  return (
    <div className={classes.container} style={{ height: height - 130 }}>
      <View />
      <div className={classes.divider} />
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        className={classes.root}
      >
        {config.properties.map(prop =>
          render(
            contract,
            prop,
            0,
            classes,
            itemsClosed,
            setItemsClosed,
            setSelect
          )
        )}
      </List>
      <Edit
        onClose={() => {
          setSelect(null)
        }}
        onValidate={value => {
          setSelect(null)
          dispatch({
            type: 'CONTRACT_LINE',
            payload: { filename: selectContract, line: select, value },
          })
        }}
        item={select}
      />
    </div>
  )
}

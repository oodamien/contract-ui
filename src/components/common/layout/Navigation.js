import DescriptionIcon from '@material-ui/icons/Description'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import React, { useContext } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { AppContext } from '../../reducer/App'
import { ContractContext } from '../../reducer/Contract'

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      minWidth: `30px`,
    },
    root: {
      borderRight: '4px solid transparent',
      marginRight: '-1px',
      '&:hover': {
        background: '#f1f2f6',
      },
      '&.Mui-selected': {
        borderRightColor: '#6eb33f',
        fontWeight: 'bold',
      },
    },
  })
)

const Navigation = () => {
  const classes = useStyles({})
  const { contracts } = useContext(ContractContext)
  const appContext = useContext(AppContext)

  return (
    <>
      <List>
        {contracts.map(contract => (
          <ListItem
            key={`contract-${contract.filename}`}
            onClick={() => {
              appContext.dispatch({
                type: 'APP_SELECT',
                payload: { select: contract.filename },
              })
            }}
            selected={appContext.select === contract.filename}
            className={classes.root}
            button
          >
            <ListItemIcon className={classes.icon}>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText
              primary={`${contract.filename}${contract.extention}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Navigation

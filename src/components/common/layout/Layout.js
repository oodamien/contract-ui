import AddIcon from '@material-ui/icons/Add'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Dropzone from 'react-dropzone'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'
import PublishIcon from '@material-ui/icons/Publish'
import React, { useContext } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Navigation from './Navigation'
import { AppContext } from '../../reducer/App'
import { ContractContext } from '../../reducer/Contract'
import { Logo } from './Logo'
import { exportContracts } from '../contract/Export'

const drawerWidth = 240

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      boxShadow: 'none',
      backgroundImage: 'none',
      outline: 0,
      width: '100%',
      '&:focus': {
        boxShadow: 'none',
        backgroundImage: 'none',
        outline: 0,
      },
      '&:active': {
        boxShadow: 'none',
        backgroundImage: 'none',
        outline: 0,
      },
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    paper: {
      width: drawerWidth,
    },
    header: {
      height: 57,
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      paddingLeft: theme.spacing(1) * 2,
      borderBottom: '1px solid #dfe0e2',
    },
    title: {
      paddingLeft: theme.spacing(1) * 1.5,
      fontSize: '18px',
      fontWeight: 'bold',
    },
    titleImportant: {
      color: '#6eb33f',
    },
    icon: {
      minWidth: `30px`,
    },
    helper: {
      position: 'fixed',
      background: 'rgba(255,255,255,.9)',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
  })
)

async function readFile(file) {
  const result = await new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.onload = () => resolve(fileReader.result)
    fileReader.readAsText(file)
  })
  return result
}

const Layout = ({ children }) => {
  const classes = useStyles({})
  const { contracts, dispatch } = useContext(ContractContext)
  const appContext = useContext(AppContext)

  let exist = true
  let i = contracts.length
  let filename = ``

  const filenameExist = str => {
    return contracts.filter(contract => contract.filename === str).length > 0
  }

  while (exist) {
    i += 1
    filename = `contract-${i}`
    exist = filenameExist(filename)
  }

  const loadFiles = files => {
    let lastFilename = ''
    files.forEach(file => {
      let { name } = file
      name = name.replace('.yml', '').replace('.yaml', '')
      const result = readFile(file)
      exist = contracts.filter(c => c.filename === name).length > 0
      result.then(val => {
        dispatch({
          type: exist ? 'CONTRACT_UPDATE' : 'CONTRACT_CREATE',
          payload: {
            filename: name,
            contract: val,
          },
        })
      })
      lastFilename = name
    })
    if (lastFilename) {
      appContext.dispatch({
        type: 'APP_SELECT',
        payload: { select: lastFilename },
      })
    }
  }

  return (
    <>
      <CssBaseline />
      <Dropzone onDrop={files => loadFiles(files)}>
        {({ getRootProps, isDragActive }) => (
          <div className={classes.root} {...getRootProps()}>
            <Drawer
              className={classes.drawer}
              variant='permanent'
              classes={{
                paper: classes.paper,
              }}
              anchor='left'
            >
              <div className={classes.header}>
                <Logo />
                <span className={classes.title}>
                  Contract <span className={classes.titleImportant}>UI</span>
                </span>
              </div>
              {contracts.length > 0 && (
                <>
                  <Navigation />
                  <Divider />
                </>
              )}
              {isDragActive && <div className={classes.helper} />}
              <List>
                <ListItem
                  button
                  onClick={() => {
                    dispatch({
                      type: 'CONTRACT_CREATE',
                      payload: {
                        filename,
                        contract: `label: some_label
input:
  triggeredBy: bookReturnedTriggered
outputMessage:
  sentTo: activemq:output
  body:
    bookName: foo
  headers:
    BOOK-NAME: foo
    contentType: application/json`,
                      },
                    })
                    appContext.dispatch({
                      type: 'APP_SELECT',
                      payload: {
                        select: filename,
                      },
                    })
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <AddIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary='New' />
                </ListItem>

                <ListItem
                  button
                  disabled={contracts.length < 1}
                  onClick={() => {
                    exportContracts('all.zip', contracts)
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <PublishIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary='Export' />
                </ListItem>
              </List>
            </Drawer>
            {children}
          </div>
        )}
      </Dropzone>
    </>
  )
}

Layout.defaultProps = {
  children: null,
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout

import AppBar from '@material-ui/core/AppBar'
import CodeIcon from '@material-ui/icons/Code'
import DeleteIcon from '@material-ui/icons/Delete'
import DescriptionIcon from '@material-ui/icons/Description'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import NearMeIcon from '@material-ui/icons/NearMe'
import PublishIcon from '@material-ui/icons/Publish'
import RedoIcon from '@material-ui/icons/Redo'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import UndoIcon from '@material-ui/icons/Undo'
import get from 'lodash.get'
import React, { useContext, useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Editor from './Editor'
import FilenameUpdate from './FilenameUpdate'
import { AppContext } from '../../reducer/App'
import { Builder } from './builder/index'
import { ContractContext } from '../../reducer/Contract'
import { exportContract } from './Export'

const drawerWidth = 240

const useStyles = makeStyles(theme =>
  createStyles({
    bar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      background: '#FFF',
    },
    toolbar: {
      minHeight: 56,
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1) * 1.5,
      marginTop: 40,
    },
    title: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      fontSize: '15px',
      fontWeight: 'bold',
      cursor: 'Pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    divider: {
      display: 'inline-block',
      height: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      borderRight: '1px solid #dfe0e2',
    },
    button: {
      padding: theme.spacing(1),
    },
    tabItem: {
      minHeight: 'auto',
      position: 'relative',
      padding: 6,
      paddingTop: 4,
      minWidth: 'auto',
      paddingLeft: 48,
      paddingRight: 16,
      fontSize: '14px',
      letterSpacing: 0,
      fontWeight: 'bold',
      color: '#222',
    },
    tabIcon: {
      position: 'absolute',
      top: 4,
      left: 16,
    },
    tabs: {
      minHeight: 40,
      marginBottom: -1,
      zIndex: 1000,
      paddingLeft: 8,
      marginTop: 16,
    },
    indicator: {
      height: 3,
    },
    paper: {
      background: 'white',
      border: '1px solid #dfe0e2',
    },
  })
)

function Contract() {
  const classes = useStyles({})
  const { contracts, dispatch } = useContext(ContractContext)
  const appContext = useContext(AppContext)
  const contract = contracts.find(c => c.filename === appContext.select)
  const [editor, setEditor] = useState(get(contract, 'contract', ''))

  useEffect(() => {
    setEditor(get(contract, 'contract', ''))
  }, [contract, setEditor, contracts])

  if (contract) {
    return (
      <>
        <AppBar color='default' position='fixed' className={classes.bar}>
          <Toolbar className={classes.toolbar}>
            <DescriptionIcon />
            <FilenameUpdate>
              <Typography className={classes.title} variant='h6' noWrap>
                {contract.filename}
                {contract.extention}
              </Typography>
            </FilenameUpdate>
            <Divider orientation='vertical' className={classes.divider} />
            <IconButton
              className={classes.button}
              aria-label='Undo'
              color='default'
              disabled={!get(contract, 'history.past.length', 0)}
              onClick={() => {
                dispatch({
                  type: 'CONTRACT_UNDO',
                  payload: { filename: contract.filename },
                })
              }}
            >
              <UndoIcon />
            </IconButton>
            <IconButton
              className={classes.button}
              aria-label='Redo'
              color='default'
              disabled={!get(contract, 'history.future.length', 0)}
              onClick={() => {
                dispatch({
                  type: 'CONTRACT_REDO',
                  payload: { filename: contract.filename },
                })
              }}
            >
              <RedoIcon />
            </IconButton>
            <Divider orientation='vertical' className={classes.divider} />
            <IconButton
              className={classes.button}
              onClick={() => {
                exportContract(
                  contract.filename,
                  contract.extention,
                  contract.contract
                )
              }}
              color='default'
            >
              <PublishIcon />
            </IconButton>
            <Divider orientation='vertical' className={classes.divider} />
            <IconButton
              className={classes.button}
              color='default'
              onClick={() => {
                dispatch({
                  type: 'CONTRACT_DELETE',
                  payload: { filename: contract.filename },
                })
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Tabs
            value={get(appContext, 'tab')}
            onChange={(e, value) => {
              if (get(appContext, 'tab') === 'builder') {
                dispatch({
                  type: 'CONTRACT_UPDATE',
                  payload: {
                    filename: contract.filename,
                    contract: editor,
                  },
                })
              }
              appContext.dispatch({
                type: 'TAB_SELECT',
                payload: {
                  tab: value,
                },
              })
            }}
            indicatorColor='secondary'
            textColor='secondary'
            classes={{ indicator: classes.indicator }}
            className={classes.tabs}
          >
            <Tab
              className={classes.tabItem}
              icon={<NearMeIcon className={classes.tabIcon} />}
              label='Builder'
              disabled={!get(contract, 'isValid', false)}
              value='builder'
            />
            <Tab
              className={classes.tabItem}
              icon={<CodeIcon className={classes.tabIcon} />}
              label='Editor'
              value='editor'
            />
          </Tabs>
          <div className={classes.paper}>
            {get(appContext, 'tab') === 'builder' && (
              <>
                <Builder />
              </>
            )}
            {get(appContext, 'tab') === 'editor' && (
              <>
                <Editor
                  code={editor}
                  onChange={value => {
                    setEditor(value)
                    dispatch({
                      type: 'CONTRACT_UPDATE',
                      payload: {
                        filename: contract.filename,
                        contract: value,
                      },
                    })
                  }}
                />
              </>
            )}
          </div>
        </main>
      </>
    )
  }
  return <div />
}

export default Contract

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import get from 'lodash.get'
import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Editor from './Editor'
import { isObject } from '../../../../utils/Api'

const useStyles = makeStyles(theme =>
  createStyles({
    tabs: {
      '& .MuiTabs-flexContainer': {
        borderBottom: `2px solid ${theme.palette.divider}`,
      },
    },
  })
)

function TabPanel(props) {
  const { children, value, index } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

TabPanel.defaultProps = {
  children: '',
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function Modal({ onClose, onValidate, item }) {
  const [value, setValue] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  const [tab, setTab] = useState(0)
  const classes = useStyles()

  useEffect(() => {
    const val = get(item, 'value', '')
    if (val !== '') {
      setIsUpdate(true)
    }
    if (isObject(val)) {
      setValue(JSON.stringify(val, null, 2))
    } else {
      setValue(val)
    }
  }, [item])

  return (
    <Dialog open={item !== null} onClose={onClose} fullWidth maxWidth='md'>
      <form
        onSubmit={e => {
          e.preventDefault()
          onValidate(value)
        }}
      >
        <DialogTitle>{item?.name || 'n/a'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </DialogContentText>

          <Tabs
            value={tab}
            onChange={(event, newValue) => {
              setTab(newValue)
            }}
            className={classes.tabs}
            indicatorColor='secondary'
            textColor='secondary'
            aria-label='icon label tabs example'
          >
            <Tab label='Text' />
            <Tab label='JSON' />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <TextField
              id='standard-multiline-flexible'
              multiline
              rows='10'
              rowsMax='30'
              value={value}
              autoFocus
              fullWidth
              variant='outlined'
              onKeyDown={e => {
                if (e.keyCode === 13 && e.metaKey) {
                  onValidate(value)
                }
              }}
              onChange={event => {
                setValue(event.target.value)
              }}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Editor
              code={value}
              onChange={val => {
                setValue(val)
              }}
            />
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit' color='primary'>
            {isUpdate ? 'Update property' : 'Add property'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

Modal.defaultProps = {
  item: null,
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  item: PropTypes.any,
}

export default Modal

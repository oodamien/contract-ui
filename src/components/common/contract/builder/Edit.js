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
import get from 'lodash.get'
import React, { useEffect, useState } from 'react'

import { isObject } from '../../../utils/Api'

function Edit({ onClose, onValidate, item }) {
  const [value, setValue] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  const [tab, setTab] = useState('text')

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
    <Dialog open={item !== null} onClose={onClose} fullWidth='md' maxWidth='md'>
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
            onChange={val => {
              setTab(val)
            }}
            variant='fullWidth'
            indicatorColor='secondary'
            textColor='secondary'
            aria-label='icon label tabs example'
          >
            <Tab value='text' label='Text' />
            <Tab value='json' label='JSON' />
            <Tab value='keyvalue' label='Key/Value' />
          </Tabs>

          <TextField
            id='standard-multiline-flexible'
            label='Value (string, json, ...)'
            multiline
            rows='10'
            rowsMax='30'
            value={value}
            autoFocus
            fullWidth
            onKeyDown={e => {
              if (e.keyCode === 13 && e.metaKey) {
                onValidate(value)
              }
            }}
            onChange={event => {
              setValue(event.target.value)
            }}
          />
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

Edit.defaultProps = {
  item: null,
}

Edit.propTypes = {
  onClose: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  item: PropTypes.any,
}

export default Edit

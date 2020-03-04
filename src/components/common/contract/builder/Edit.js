import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import get from 'lodash.get'
import React, { useEffect } from 'react'

import { isObject } from './View'

function Edit({ onClose, onValidate, item }) {
  const [value, setValue] = React.useState('')
  const [isUpdate, setIsUpdate] = React.useState(false)

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
    // isObject
  }, [item])

  return (
    <Dialog open={item !== null} onClose={onClose}>
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
          <TextField
            id='standard-multiline-flexible'
            label='Value (string, json, ...)'
            multiline
            rowsMax='4'
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

Edit.propTypes = {
  onClose: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  item: PropTypes.any,
}

export default Edit

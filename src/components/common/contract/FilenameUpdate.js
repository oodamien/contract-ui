import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import React, { useContext } from 'react'

import { AppContext } from '../../reducer/App'
import { ContractContext } from '../../reducer/Contract'

function FilenameUpdate({ children }) {
  const { contracts, dispatch } = useContext(ContractContext)
  const appContext = useContext(AppContext)
  const contract = contracts.find(c => c.filename === appContext.select)
  const [open, setOpen] = React.useState(false)
  const [filename, setFilename] = React.useState(`${contract.filename}`)

  const closeDialog = () => {
    setOpen(false)
  }

  const submit = () => {
    let setUpdate = true
    if (contract.filename === filename) {
      setUpdate = false
    }
    if (setUpdate) {
      dispatch({
        type: 'CONTRACT_UPDATE_FILENAME',
        payload: { filename: contract.filename, newFilename: filename },
      })
      appContext.dispatch({
        type: 'APP_SELECT',
        payload: { select: filename },
      })
    }
    closeDialog()
  }

  return (
    <>
      <span
        onClick={() => {
          setFilename(contract.filename)
          setOpen(true)
        }}
      >
        {children}
      </span>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {contract.filename}
          {contract.extention}
        </DialogTitle>

        <form
          onSubmit={e => {
            e.preventDefault()
            submit()
          }}
        >
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              You can rename your contract file.
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='filename'
              label='Filename'
              onChange={event => {
                setFilename(event.target.value.trim())
              }}
              value={filename}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color='default'>
              Cancel
            </Button>
            <Button onClick={submit} color='primary'>
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

FilenameUpdate.defaultProps = {
  children: null,
}

FilenameUpdate.propTypes = {
  children: PropTypes.node,
}

export default FilenameUpdate

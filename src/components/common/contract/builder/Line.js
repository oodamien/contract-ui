import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { ContractContext } from '../../../reducer/Contract'
import { isObject } from '../../../utils/Api'

const useStyles = makeStyles(theme =>
  createStyles({
    line: {
      display: 'block',
      color: theme.palette.text.primary,
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

export default function Line({ contract, id, label, value, level, onClick }) {
  const classes = useStyles()
  const { dispatch } = useContext(ContractContext)
  return (
    <a
      href='/#'
      className={`${classes.line} level${level} ${value ? 'line-hover' : ''}`}
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
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
    </a>
  )
}

Line.defaultProps = {
  value: null,
}

Line.propTypes = {
  contract: PropTypes.shape({
    filename: PropTypes.string.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  level: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}

import MonacoEditor from 'react-monaco-editor'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import useWindowDimensions from '../../../../utils/WindowDimensions'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      border: '1px solid rgba(0, 0, 0, 0.22)',
      padding: '12px 6px',
      borderRadius: 5,
      '&.isHover': {
        borderColor: 'rgba(0, 0, 0, 0.82)',
      },
      '&.isFocus': {
        borderColor: theme.palette.primary.main,
        boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}`,
      },
    },
  })
)

function Editor({ code, onChange }) {
  const classes = useStyles()
  const { height } = useWindowDimensions()
  const [isFocus, setIsFocus] = useState(true)
  const [isHover, setIsHover] = useState(false)

  const editorDidMount = (editor, monaco) => {
    editor.onDidFocusEditorText(() => {
      setIsFocus(true)
    })
    editor.onDidBlurEditorText(() => {
      setIsFocus(false)
    })
    editor.onMouseMove(() => {
      setIsHover(true)
    })
    editor.onMouseLeave(() => {
      setIsHover(false)
    })
    editor.focus()
  }

  return (
    <div
      className={`${classes.root} ${isFocus ? 'isFocus' : ''} ${
        isHover ? 'isHover' : ''
      }`}
    >
      <MonacoEditor
        height={height - 400}
        language='json'
        value={code}
        options={{
          selectOnLineNumbers: true,
          lineNumbersMinChars: 4,
          minimap: {
            enabled: false,
          },
        }}
        editorDidMount={(editor, monaco) => {
          editorDidMount(editor, monaco)
        }}
        onChange={value => {
          if (onChange) {
            onChange(value)
          }
        }}
      />
    </div>
  )
}

Editor.defaultProps = {
  code: '',
  onChange: null,
}

Editor.propTypes = {
  code: PropTypes.string,
  onChange: PropTypes.func,
}

export default Editor

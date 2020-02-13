import MonacoEditor from 'react-monaco-editor'
import PropTypes from 'prop-types'
import React from 'react'

import useWindowDimensions from '../../utils/WindowDimensions'

function Editor({ code, onChange }) {
  const { height } = useWindowDimensions()
  return (
    <MonacoEditor
      height={height - 130}
      language='yaml'
      value={code}
      options={{
        selectOnLineNumbers: true,
        lineNumbersMinChars: 4,
        minimap: {
          enabled: false,
        },
      }}
      onChange={value => {
        if (onChange) {
          onChange(value)
        }
      }}
    />
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

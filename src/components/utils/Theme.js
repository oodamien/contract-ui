import { createMuiTheme } from '@material-ui/core/styles'

const MuiTheme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  palette: {
    primary: {
      main: '#019cff',
      dark: '#0188ff',
    },
    secondary: {
      main: '#6eb33f',
      dark: '#58a432',
      contrastText: '#fff',
    },
    background: {
      paper: '#FFF',
      default: '#f1f2f6',
    },
    action: {
      active: '#222',
      hover: '#f1f2f6',
      hoverOpacity: 0.08,
      selected: 'rgba(0, 0, 0, 0.14)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(255,255,255, 0.12)',
    },
  },
  typography: {
    fontSize: 13,
    fontFamily: 'Karla',
    body1: {
      letterSpacing: 0,
    },
    button: {
      fontSize: '0.9rem',
      letterSpacing: 0,
      fontWeight: 'bold',
    },
  },
  overrides: {
    MuiButton: {
      contained: {
        boxShadow: 'none',
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: 'none',
        borderBottom: '1px solid #dfe0e2',
      },
    },
    MuiDialog: {
      scrollPaper: {
        alignItems: 'none',
      },
      container: {
        height: 'auto',
      },
    },
    MuiListItem: {
      root: {
        paddingTop: '5px',
        paddingBottom: '5px',
        '&.Mui-selected': {
          background: '#f1f2f6',
        },
        '&.Mui-selected:hover': {
          background: '#f1f2f6',
        },
      },
    },
  },
})

export default MuiTheme

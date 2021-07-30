import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { iconInfo } from '@/assets/svg'
import { TextField } from '@material-ui/core'
import { FloatMessage } from '@/components/modules'

const useStyles = makeStyles((theme) => ({
  root: {
    '&>div:first-child': {
      margin: '10px 0',
      height: '25px',
      display: 'flex',
      alignItems: 'center',
      '&>span': {
        fontFamily: 'Helvetica',
        fontSize: '0.8em',
        verticalAlign: 'middle',
      },
      '&>img': {
        marginLeft: '5px',
        width: '14px',
        verticalAlign: 'middle',
      },
    },
  },
  AmountInput: {
    border: '#272727 2px solid',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    '& input': {
      fontFamily: 'Gillsans',
      padding: '0',
      margin: '0 5px 0 0',
      fontSize: (props) => `${props.fontSize}px`,
      fontWeight: 'bold',
      border: 'none',
      width: '100%',
      color: '#30384B',
    },
    '& button': {
      fontFamily: 'Gillsans',
      fontSize: '0.8em',
      color: 'white',
      background: '#30384B',
      border: 'none',
      padding: '2px 5px',
      position: 'relative',
      '&[disabled]': {
        background: '#d4d4d4',
      },
      '&>span': {
        fontFamily: 'Helvetica',
        position: 'absolute',
        transform: 'translate(-32px,-16px)',
        color: '#30384B',
        fontSize: '10px',
      },
    },
  },
  amount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&>div': {
      width: '100%',
      '&>div': {
        '&:before,&:after,&:hover:not(.Mui-disabled):before': {
          border: 'none',
        },
      },
    },
  },
  token: {
    fontFamily: 'Gillsans',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#30384B',
    marginLeft: '2px',
  },
  dollar: {
    color: '#99A8C9',
    margin: '5px',
    fontWeight: 'bold',
    fontFamily: 'Gillsans',
    fontSize: '12px',
  },
}))

export default function AmountInput({ state: { state, setState, lite }, title, click, style }) {
  const [fontSize, setFontSize] = useState(35)
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles({ fontSize })
  const inputRef = useRef()
  const changInput = useCallback(
    (event) => {
      const e = event.target
      setState({ I: { ...state.I, [title]: e.value, old: state.I[title] } })
    },
    [state.I],
  )
  useEffect(() => {
    const e = inputRef.current
    const [newV, oldV] = [state.I[title], state.I.old]
    if (newV.length > (oldV || '').length) {
      if (e.offsetWidth == e.scrollWidth || fontSize < 8) return
      setFontSize(fontSize * 0.8)
    } else if (newV.length < (oldV || '').length) {
      if (e.offsetWidth < e.scrollWidth || fontSize > 35) return
      setFontSize(fontSize * 1.25)
    }
  }, [fontSize, state.I])
  return useMemo(
    () => (
      <div className={classes.root}>
        <div>
          <span>{title.toUpperCase()}</span>
          <img
            onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
            onMouseLeave={() => setAnchorEl(null)}
            alt={title}
            src={iconInfo}
          />
          <FloatMessage anchorEl={anchorEl} info={lite.info(title)} />
        </div>
        <div className={classes.AmountInput} style={style}>
          <div className={classes.amount}>
            <TextField
              value={state.I[title]}
              type="number"
              onChange={changInput}
              inputRef={inputRef}
              placeholder="0.00"
              InputProps={{
                endAdornment: (
                  <button onClick={click.max} disabled={!click.condition()}>
                    MAX
                    <span>balance</span>
                  </button>
                ),
              }}
            ></TextField>
          </div>
          <span className={classes.token}>{lite.transform('token', 'name', title).symbol}</span>
          <span className={classes.dollar}>~$456,233,000.234</span>
        </div>
      </div>
    ),
    [state.I, anchorEl, click, fontSize],
  )
}

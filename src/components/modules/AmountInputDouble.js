import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { iconInfo } from '@/assets/svg'
import { TextField, Tabs, Tab } from '@material-ui/core'
import { FloatMessage } from '@/components/modules'
import PhoneIcon from '@material-ui/icons/Phone'
const useStyles = makeStyles((theme) => ({
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
      fontSize: (props) => props.fontSize,
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

const MyTabs = withStyles({
  root: {
    minHeight: '0',
  },
  flexContainer: {
    margin: '10px 0',
    height: '25px',
    '&>button': {
      minHeight: '0',
      minWidth: '0',
      padding: '0',
      marginRight: '15px',
      border: 'none !important',
      fontFamily: 'Helvetica',
      fontSize: '0.8em',
      textTransform: 'uppercase',
      '&>span': {
        alignItems: 'start',
      },
    },
  },
  indicator: {
    display: 'none',
  },
})((props) => {
  const [anchorEl, setAnchorEl] = useState({})
  return (
    <div style={{ position: 'relative' }}>
      <Tabs {...props}>
        {props.labels.map((v, k) => (
          <Tab
            disableRipple
            key={k}
            classes={{ selected: makeStyles({ s: { fontWeight: 'bold', color: '#275bff' } })().s }}
            label={
              <div style={{}}>
                <span style={{ verticalAlign: 'middle' }}>{v}</span>
                <img
                  onMouseEnter={(e) => setAnchorEl({ [k]: e.currentTarget })}
                  onMouseLeave={() => setAnchorEl({})}
                  alt=""
                  src={iconInfo}
                  style={{ width: '14px', marginLeft: '5px', verticalAlign: 'middle' }}
                />
                <FloatMessage anchorEl={anchorEl[k]} info={props.info[k]} />
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  )
})

const MyInput = ({ state, setState, lite, title, click, style }) => {
  const [fontSize, setFontSize] = useState(35)
  const classes = useStyles({ fontSize })
  const inputRef = useRef()
  const changInput = useCallback(
    (event) => {
      const e = event.target
      setState({ I: { ...state.I, [title]: e.value }, old: { ...state.old, [title]: state.I[title] } })
    },
    [state.I, title],
  )
  useEffect(() => {
    const e = inputRef.current
    const [newV, oldV] = [state.I[title], state.old[title]]
    if (newV.length > (oldV || '').length) {
      if (e.offsetWidth == e.scrollWidth || fontSize < 8) return
      setFontSize(fontSize * 0.8)
    } else if (newV.length < (oldV || '').length) {
      if (e.offsetWidth < e.scrollWidth || fontSize > 35) return
      setFontSize(fontSize * 1.25)
    }
  }, [fontSize, state.I, title])
  return (
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
  )
}

export default function AmountInputDouble({ state: { state, setState, lite }, title, click, style }) {
  const [tabs, setTabs] = useState(0)
  return useMemo(
    () => (
      <div>
        <MyTabs value={tabs} onChange={(_, v) => setTabs(v)} labels={title} info={title.map((val) => lite.info(val))} />
        <MyInput {...{ title: title[tabs], click: click[tabs], state, setState, lite, style }} />
      </div>
    ),
    [state.I, click, tabs],
  )
}

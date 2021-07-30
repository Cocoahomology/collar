import { useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { iconInfo } from '@/assets/svg'
import { FloatMessage } from '@/components/modules'
import DynamicFont from 'react-dynamic-font'

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
  AmountShow: {
    border: '#272727 2px solid',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#30384B',
    fontFamily: 'Gillsans',
    fontWeight: 'bold',
    '&>div': {
      maxWidth: 'calc(50vw - 85.5px)',
      '&>span': {
        fontSize: '2em',
      },
    },
    '&>span': {
      fontSize: '12px',
      marginLeft: '2px',
    },
  },
  dollar: {
    color: '#99A8C9',
    margin: '5px',
  },
}))

export default function AmountShow({ state: { state, lite }, title, style }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  return useMemo(
    () => (
      <div className={classes.root}>
        <div>
          <span>{title.toUpperCase()}</span>
          <img
            onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
            onMouseLeave={() => setAnchorEl(null)}
            alt=""
            src={iconInfo}
          />
          <FloatMessage anchorEl={anchorEl} info={lite.info(title)} />
        </div>

        <div className={classes.AmountShow} style={style}>
          <div>
            <DynamicFont content={parseFloat(lite.transform('str', title, state.output[title])).toFixed(3)} />
          </div>
          <span>{lite.transform('token', 'name', title).symbol}</span>
          <span className={classes.dollar}>~$456,233,000.234</span>
        </div>
      </div>
    ),
    [state.output, anchorEl],
  )
}

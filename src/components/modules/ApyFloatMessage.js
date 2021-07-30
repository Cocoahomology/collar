import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FloatMessage2 } from '.'
import { iconInfo } from '@/assets/svg'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '-10px 0 10px 0',
    textAlign: 'right',
    fontFamily: 'Helvetica',
    fontSize: '0.8em',
    '& img': {
      width: '1em',
      margin: '0 5px',
    },
  },
}))

export default function ApyFloatMessage({ APY, info }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const infoStr = info
    .map((val) => {
      let key = Object.keys(val)[0]
      return `${key} = ${val[key]}`
    })
    .join(`\n`)
  return (
    <div className={classes.root}>
      <span>APY = {APY}%</span>
      <img
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
        alt=""
        src={iconInfo}
      />
      <FloatMessage2 anchorEl={anchorEl} info={infoStr} />
    </div>
  )
}

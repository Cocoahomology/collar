import { makeStyles } from '@material-ui/core/styles'
import { Popover } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
    opacity: '0.95',
  },
  paper: {
    overflow: 'hidden',
    '&>div': {
      backgroundColor: 'gray',
      color: 'white',
      padding: '10px',
      wordBreak: 'break-word',
      maxWidth: '50vw',
    },
  },
}))

export default function FloatMessage(props) {
  const classes = useStyles()
  const { anchorEl, info } = props
  return (
    <Popover
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
    >
      <div>{info}</div>
    </Popover>
  )
}

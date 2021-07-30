import { withStyles } from '@material-ui/core/styles'

export default withStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // margin: '10px',
    '&>div': {
      position: 'relative',
      backgroundColor: 'white',
      boxSizing: 'border-box',
      border: '#4C4C4C 4px solid',
    },
  },
  main: {
    zIndex: '4',
    width: '100%',
  },
  second: {
    zIndex: '2',
    transform: 'translateY(-10px)',
    height: '15px',
    width: 'calc(100% - 20px)',
  },
  third: {
    zIndex: '1',
    transform: 'translateY(-20px)',
    height: '15px',
    width: 'calc(100% - 40px)',
  },
})(({ classes, children }) => {
  return (
    <div className={classes.root}>
      <div className={classes.main}>{children}</div>
      <div className={classes.second}></div>
      <div className={classes.third}></div>
    </div>
  )
})

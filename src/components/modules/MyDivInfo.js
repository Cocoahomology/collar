import { withStyles } from '@material-ui/core/styles'
import DynamicFont from 'react-dynamic-font'

export default withStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&>div': {
      position: 'relative',
      backgroundColor: 'white',
      boxSizing: 'border-box',
      border: '#4C4C4C 3px solid',
    },
  },
  main: {
    zIndex: '4',
    width: '100%',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  second: {
    zIndex: '2',
    transform: 'translateY(-11px)',
    height: '15px',
    width: 'calc(100% - 20px)',
  },
  third: {
    zIndex: '1',
    transform: 'translateY(-22px)',
    height: '15px',
    width: 'calc(100% - 40px)',
  },
})(({ classes, title, remarks, amount, token, color }) => {
  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div style={{ color: '#30384B', fontSize: '16px', fontFamily: 'Helvetica' }}>
          <DynamicFont content={title} />
        </div>
        <div style={{ color: '#A3B7E4', fontSize: '10px', fontFamily: 'Helvetica', marginBottom: '10px' }}>
          <DynamicFont content={remarks} />
        </div>
        <div style={{ color: color || '#30384B', fontSize: '18px', fontWeight: 'bold' }}>
          <DynamicFont content={amount} />
        </div>
        <span style={{ color: '#30384B', fontSize: '15px', fontWeight: 'bold' }}>{token}</span>
      </div>
      <div className={classes.second}></div>
      <div className={classes.third}></div>
    </div>
  )
})

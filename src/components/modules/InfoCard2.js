import { makeStyles } from '@material-ui/core/styles'
import DynamicFont from 'react-dynamic-font'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingBottom: '20px',
    marginBottom: '10px',
    '&>div>hr': {
      position: 'absolute',
      width: '100%',
      bottom: 0,
    },
  },
  title: {
    fontFamily: 'Gillsans',
    fontSize: '0.9em',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '5px 0',
  },
  data: {
    fontFamily: 'Gillsans',
    alignSelf: 'flex-start',
    color: 'white',
    fontSize: '1.4em',
    overflow: 'hidden',
    maxWidth: '100%',
    marginBottom: '10px',
  },
  info: {
    fontFamily: 'Gillsans',
    textAlign: 'start',
    fontSize: '10px',
    color: 'white',
    whiteSpace: 'pre-line',
  },
}))

export default function InfoCard2({ title, data, info, noHr, styles }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div>
        <div className={classes.title}>
          <span>{title}</span>
        </div>
        {data && (
          <div className={classes.data}>
            <DynamicFont content={data} />
          </div>
        )}
        {info && (
          <div className={classes.info} style={styles}>
            <span>{info}</span>
          </div>
        )}
      </div>
      {noHr || (
        <div>
          <hr />
        </div>
      )}
    </div>
  )
}

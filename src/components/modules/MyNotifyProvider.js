import { forwardRef } from 'react'
import { SnackbarContent, SnackbarProvider } from 'notistack'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import SuccessIcon from '@/assets/svg/statusApproved.svg'
import FailedIcon from '@/assets/svg/statusUnapproved.svg'
import ConnectErrorIcon from '@/assets/svg/statusConnectError.svg'
import NewroundLeftIcon from '@/assets/svg/statusNewroundLeft.svg'
import NewroundRightIcon from '@/assets/svg/statusNewroundRight.svg'
import AnyIcon from '@/assets/svg/statusAny.svg'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '3px',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    width: '400px',
    maxWidth: '70vw',
    height: 'auto',
    padding: '15px',
    border: '#979797 1px solid',
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow:
      '0px 5px 5px -3px rgb(38 111 239 / 10%), 0px 8px 10px 1px rgb(38 111 239 / 8%), 0px 3px 14px 2px rgb(38 111 239 / 10%)',
    '& img': {
      marginRight: '15px',
    },
    '&>div': {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  title: { fontSize: '16px', color: (props) => props.title, display: (props) => props.display },
  info: { fontSize: '14px', color: (props) => props.info },
}))

const icon = {
  success: SuccessIcon,
  failed: FailedIcon,
  connecterr: ConnectErrorIcon,
  newroundl: NewroundLeftIcon,
  newroundr: NewroundRightIcon,
  any: AnyIcon,
}

const MyNotify = forwardRef(function myNotify({ info: { type, title, message } }, ref) {
  const styleProps = {
    title: '#2AC592',
    info: '#535353',
    display: 'block',
  }
  switch (type) {
    case 'failed':
      styleProps['title'] = '#F25757'
      break
    case 'connecterr':
    case 'any':
      styleProps['display'] = 'none'
      styleProps['info'] = '#F25757'
      break
    case 'newroundl':
    case 'newroundr':
      styleProps['display'] = 'none'
      styleProps['info'] = '#2AC592'
      break
    default:
      break
  }
  const classes = useStyles(styleProps)
  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <div className={classes.content}>
        <img alt="" src={icon[type]} />
        <div>
          <span className={classes.title}>{title}</span>
          <span className={classes.info}>{message}</span>
        </div>
      </div>
    </SnackbarContent>
  )
})

export default withStyles({
  root: {
    top: '50px',
  },
})(({ classes, children }) => (
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={5000}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    classes={{ root: classes.root }}
    content={(_, info) => <MyNotify info={info} />}
  >
    {children}
  </SnackbarProvider>
))

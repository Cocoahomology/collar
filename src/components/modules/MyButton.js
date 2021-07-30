import { makeStyles } from '@material-ui/core/styles'
import buttonImg from '@/assets/svg/buttonAble.svg'
import buttonDisabledImg from '@/assets/svg/buttonDisabled.svg'

const useStyles = makeStyles((theme) => ({
  button: {
    padding: '0',
    background: 'none',
    border: 'none',
    position: 'relative',
    '&:hover': {
      opacity: 0.8,
    },
    '&:active': {
      transform: 'translateY(3px)',
    },
    '&:focus': {},
    '&>img': {
      width: '100%',
      height: '50px',
    },
    '&>div': {
      color: '#fff',
      left: '0',
      width: '100%',
      height: '100%',
      fontWeight: 'bold',
      position: 'absolute',
      display: 'flex',
      '& span': {
        fontFamily: 'Gillsans',
        fontSize: '1.1em',
        margin: 'auto',
      },
      transform: 'translateY(-6px)',
    },
  },
}))

export default function Button({ name, onClick, style, disabled }) {
  const classes = useStyles()
  return (
    <button className={classes.button} {...{ onClick, style, disabled }}>
      <div>
        <span>{name}</span>
      </div>
      <img alt={name} src={disabled ? buttonDisabledImg : buttonImg} />
    </button>
  )
}

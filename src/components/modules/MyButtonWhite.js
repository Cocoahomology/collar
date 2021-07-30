import { makeStyles } from '@material-ui/core/styles'
import { buttonWhite, buttonWhiteHover } from '@/assets/svg'

const useStyles = makeStyles((theme) => ({
  button: {
    padding: '0',
    background: 'none',
    border: 'none',
    position: 'relative',
    backgroundImage: `url(${buttonWhite})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '133px',
    minHeight: '37px',
    color: 'white',
    margin: '5px 0',
    fontSize: '14px',
    fontFamily: 'Gillsans',
    '&:hover': {
      backgroundImage: `url(${buttonWhiteHover})`,
    },
    '&:active': {
      transform: 'translateY(3px)',
    },
    '&:focus': {},
  },
  span: {
    position: 'absolute',
    transform: 'translate(-50%, -70%)',
  },
}))

export default function Button({ name, onClick, disabled }) {
  const classes = useStyles()
  return (
    <button className={classes.button} {...{ onClick, disabled }}>
      <span className={classes.span}>{name}</span>
    </button>
  )
}

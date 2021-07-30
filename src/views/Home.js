import { makeStyles } from '@material-ui/core/styles'
import { Button, Card, CardActions, CardContent, Box, Typography } from '@material-ui/core'

import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import KeyboardIcon from '@material-ui/icons/Keyboard'
import LaptopChromebookIcon from '@material-ui/icons/LaptopChromebook'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '150px',
    '&>div': {
      margin: '40px',
    },
    '@media screen and (max-width:960px)': {
      flexDirection: 'column',
      marginTop: '0px',
    },
  },
}))

export default function Home() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Box fontSize="16em" align="center">
            <LaptopChromebookIcon color="primary" fontSize="inherit" />
            <Typography variant="h3" color="primary" align="center">
              Pro
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button fullWidth color="primary" variant="contained" size="large" href="/pro">
            Go
          </Button>
        </CardActions>
      </Card>

      <Card>
        <CardContent>
          <Box fontSize="16em" align="center">
            <SportsEsportsIcon color="primary" fontSize="inherit" />
            <Typography variant="h3" color="primary" align="center">
              Lite
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button fullWidth color="primary" variant="contained" size="large" href="/lite">
            Go
          </Button>
        </CardActions>
      </Card>

      <Card>
        <CardContent>
          <Box fontSize="16em" align="center">
            <KeyboardIcon color="primary" fontSize="inherit" />
            <Typography variant="h3" color="primary" align="center">
              Term
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button fullWidth color="primary" variant="contained" size="large" href="/term">
            Go
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

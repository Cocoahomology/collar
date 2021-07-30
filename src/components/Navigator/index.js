import { useContext, useState } from 'react'
import { Context } from '@/store'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Drawer, Box, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText, Hidden } from '@material-ui/core'

import Lite from '@/views/Lite'
import Pro from '@/views/Pro'
import Term from '@/views/Term'
import Home from '@/views/Home'
import MyPage from '@/views/MyPage'

import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import LaptopChromebookIcon from '@material-ui/icons/LaptopChromebook'
import KeyboardIcon from '@material-ui/icons/Keyboard'
import PersonIcon from '@material-ui/icons/Person'

import { LiteIcon, TermIcon, ProIcon, MypageIcon, CloseMenuIcon } from '@/assets/svg'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '&>div': {
      display: 'flex',
      flexDirection: 'row',
      background: 'none',
      border: 'none',
    },
  },
  listItem: {
    flexDirection: 'column',
  },
  fontSpan: {
    '& span': {
      fontFamily: 'Gillsans',
      color: 'white',
      fontSize: '18px',
    },
  },
  blurbg: {
    '&, &:before': {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '200',
    },
    '&:after': {
      filter: 'blur(15px) brightness(110%)',
    },
  },
}))

const MyListItem = ({ onClick, item, icon, cur }) => {
  const classes = useStyles()
  return (
    <ListItem
      button
      onClick={onClick}
      key={item}
      to={`/${item.toLowerCase()}`}
      component={Link}
      className={classes.listItem}
      style={{ backgroundColor: cur == item.toLowerCase() ? '#1E2C57' : '#4C76F9', marginBottom: '20px' }}
    >
      <ListItemIcon style={{ display: 'inline-block', textAlign: 'center' }}>
        <img src={icon} alt="" />
      </ListItemIcon>
      <ListItemText primary={item} className={classes.fontSpan} />
    </ListItem>
  )
}

export default function Navigator() {
  const classes = useStyles()
  const {
    state: { menu_open, signer, registry },
    setState,
  } = useContext(Context)
  const [curpage, setCurpage] = useState(window.location.pathname.split('/')[1])
  const changePage = (item) => {
    setCurpage(item)
    setState({ menu_open: false })
  }
  return (
    <BrowserRouter>
      <Drawer variant="persistent" anchor="left" open={menu_open} className={classes.drawer}>
        <Box width="30vw" style={{ backgroundColor: '#4975FF' }}>
          <Box
            display="flex"
            style={{ minHeight: '56px', justifyContent: 'center' }}
            onClick={() => setState({ menu_open: false })}
          >
            <img src={CloseMenuIcon} alt="" />
          </Box>
          <List style={{ padding: 0 }}>
            <MyListItem onClick={() => changePage('lite')} item="Lite" icon={LiteIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('pro')} item="Pro" icon={ProIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('term')} item="Term" icon={TermIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('mypage')} item="MyPage" icon={MypageIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('home')} item="Home" icon={LiteIcon} cur={curpage} />
          </List>
        </Box>
      </Drawer>
      <div
        className={classes.blurbg}
        style={{ display: menu_open ? 'block' : 'none' }}
        onClick={() => setState({ menu_open: false })}
      ></div>
      <Box>
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/lite">
            <Lite />
          </Route>
          <Route path="/pro">
            <Pro />
          </Route>
          <Route path="/term">
            <Term />
          </Route>
          <Route path="/mypage">
            <MyPage />
          </Route>
          <Route path="/">
            <Lite />
          </Route>
        </Switch>
      </Box>
    </BrowserRouter>
  )
}

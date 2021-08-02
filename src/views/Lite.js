import { useContext, useReducer, useState, useEffect, useMemo } from 'react'
import { Context } from '@/store'
import LiteRegistry from '../libraries/lite'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Accordion, AccordionSummary, AccordionDetails, Tabs, Tab, Box, Switch } from '@material-ui/core'
import { Borrow, Repay, Deposit, Withdraw, Lend, Exit, Info, PoolSelector } from '@/components/Content'
import { useSnackbar } from 'notistack'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&>div': {
      position: 'relative',
      backgroundColor: 'white',
      '&:first-child': {
        zIndex: '4',
        margin: '20px 20px 0 20px',
      },
      '&:nth-child(2)': {
        zIndex: '2',
        transform: 'translateY(-13px)',
        boxSizing: 'border-box',
        border: '#4C4C4C 2px solid',
        height: '20px',
        width: 'calc(100% - 60px)',
      },
      '&:nth-child(3)': {
        zIndex: '1',
        transform: 'translateY(-26px)',
        boxSizing: 'border-box',
        border: '#4C4C4C 2px solid',
        height: '20px',
        width: 'calc(100% - 80px)',
      },
      //Mobile
      '@media screen and (max-width:960px)': {
        width: 'calc(100% - 40px)',
      },
      //PC
      '@media screen and (min-width:960px)': {
        width: '920px',
        '&:nth-child(2)': {
          width: '900px',
        },
        '&:nth-child(3)': {
          width: '880px',
        },
      },
    },
  },
  content: {
    zIndex: '3',
    position: 'relative',
    backgroundColor: 'white',
    border: '#4C4C4C 2px solid',
    borderTop: 'none',
    padding: '15px',
  },
  '@global': {
    '.MuiTab-textColorInherit': {
      opacity: '1',
    },
    '.Tabs .Mui-selected': {
      backgroundColor: 'white',
      border: '#4c4c4c 2px solid',
      '&>span': {
        color: '#30384b',
      },
    },
    '.Tabschild .Mui-selected': {
      '&>span': {
        color: '#275bff',
      },
    },
  },
}))
const MyAccordion = withStyles({
  root: {
    boxShadow: 'none',
    margin: '0 !important',
    '&>div:first-child': {
      minHeight: 0,
      height: 0,
    },
    '&>div:last-child div': {
      padding: 0,
      fontSize: '15px',
    },
    '&:before': {
      background: 'none',
    },
  },
})((props) => (
  <Accordion {...props} expanded={props.expanded}>
    <AccordionSummary />
    <AccordionDetails>{props.info}</AccordionDetails>
  </Accordion>
))
const MyTabs = withStyles({
  root: {
    minHeight: '0',
  },
  flexContainer: {
    height: '35px',
    backgroundColor: '#c1c1c1',
    '&>button': {
      minHeight: '0',
      padding: '0 15px',
      marginRight: '0',
      boxSizing: 'content-box',
      border: '#c1c1c1 2px solid',
      borderBottom: '#4c4c4c 2px solid',
      '&>span': {
        fontFamily: 'Gillsans',
        color: '#fff',
        alignItems: 'start',
      },
      '&:first-child': {
        borderLeft: '#4c4c4c 2px solid',
      },
      '&:last-child': {
        borderRight: '#4c4c4c 2px solid',
      },
    },
  },
  indicator: {
    backgroundColor: '#fff',
    width: 'calc(33.33% - 4px) !important',
    marginLeft: '2px',
  },
})((props) => {
  return (
    <div style={{ position: 'relative' }}>
      <Tabs {...props} variant="fullWidth">
        {props.labels.map((v, k) => (
          <Tab key={k} label={v} />
        ))}
      </Tabs>
    </div>
  )
})
const MyTabsChild = withStyles({
  root: {
    minHeight: '0',
    display: 'block',
  },
  scroller: {
    height: '35px',
  },
  flexContainer: {
    '&>button': {
      fontFamily: 'Gillsans',
      minHeight: '0',
      padding: '0',
      textTransform: 'capitalize',
      fontWeight: 'bold',
      fontSize: '1.1em',
      color: '#30384B',
      '&>span': {
        alignItems: 'start',
      },
    },
  },
  fixed: {
    width: 'auto',
  },
  indicator: {
    backgroundColor: '#275BFF',
    height: '5px',
    width: '20% !important',
    zIndex: '1',
  },
})((props) => {
  const [expanded, setExpanded] = useState(true)
  const { round, setRound } = props.round
  const classes = makeStyles((theme) => ({
    root: { position: 'relative' },
    button: {
      position: 'absolute',
      top: '2px',
      right: 0,
    },
    switch: {
      transform: 'translateY(-8px)',
    },
    expanded: {
      background: 'none',
      border: 'none',
      padding: 0,
    },
    hr: {
      position: 'absolute',
      top: '24px',
      width: '100%',
      zIndex: '0',
      borderBottom: '#D8D8D8 1px solid',
      borderTop: 'none',
    },
  }))()
  return (
    <div className={classes.root}>
      <div className={classes.button}>
        <Switch checked={round} onChange={() => setRound(!round)} className={classes.switch} />
        <button onClick={() => setExpanded(!expanded)} className={classes.expanded}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
      </div>
      <Tabs {...props} variant="standard">
        {props.labels.map((v, k) => (
          <Tab disableRipple key={k} label={v} />
        ))}
      </Tabs>
      <hr className={classes.hr} />
      <MyAccordion expanded={expanded} info={props.info} />
    </div>
  )
})

export default function Lite() {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const {
    state: { registry, signer, LiteContext },
    setState,
  } = useContext(Context)
  const [liteState, setLiteState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    tabs: 0,
    tabsChild: 0,
    round: false,
    poolList: [],
    bond: 0,
    bondList: [],
    want: 0,
    wantList: [],
    lite: new LiteRegistry(
      () => registry,
      () => registry.address.default,
      () => signer,
      console.log,
      enqueueSnackbar,
    ),
    forceUpdate: {},
  })
  useEffect(() => {
    lite.reset(null, null, () => signer)
    setLiteState({ forceUpdate: {} })
  }, [signer])

  const { tabs, tabsChild, round, lite } = liteState
  const tabsList = ['LOAN', 'FARM', 'SWAP']
  const tabsChildList = [
    ['Borrow', 'Repay'],
    ['Deposit', 'Withdraw'],
    ['Lend', 'Exit'],
  ][tabs]
  const Content = [
    [Borrow, Repay],
    [Deposit, Withdraw],
    [Lend, Exit],
  ][tabs][tabsChild]

  return (
    <LiteContext.Provider value={{ liteState, setLiteState }}>
      <div className={classes.root}>
        <div>
          <MyTabs
            className="Tabs"
            value={tabs}
            onChange={(_, v) => setLiteState({ tabs: v, tabsChild: 0 })}
            labels={tabsList}
          />
          <div className={classes.content}>
            <MyTabsChild
              className="Tabschild"
              value={tabsChild}
              onChange={(_, v) => setLiteState({ tabsChild: v })}
              labels={tabsChildList}
              info={lite.info(tabsChildList[tabsChild])}
              round={{ round, setRound: (round) => setLiteState({ round }) }}
            />
            <PoolSelector />
            <Content />
          </div>
        </div>
        <div></div>
        <div></div>
        <Info />
      </div>
    </LiteContext.Provider>
  )
}

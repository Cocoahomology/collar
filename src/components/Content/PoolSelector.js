import { useContext, useReducer, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Context } from '@/store'
import { FormControl, InputLabel, Box, Select, MenuItem } from '@material-ui/core'
import { iconInfo, iconUsdt, iconUsdc, ArrowForwardIosIcon } from '@/assets/svg'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
const useStyles = makeStyles((theme) => ({
  root: {},
  formControlTitle: {
    fontFamily: 'Helvetica',
    fontSize: '0.8em',
    display: 'block',
    margin: '10px 0',
    color: '#30384B',
  },
  formControlList: {
    display: 'flex',
    justifyContent: 'space-between',
    '&>div': {
      backgroundColor: '#F4F4F4',
      '&>div': {
        lineHeight: 'unset',
      },
      '&>div::before': {
        border: 'none',
      },
    },
  },
  formControl: {
    // minWidth: 120,
    width: '50%',
    '& span': {
      fontFamily: 'Gillsans',
    },
  },
  icon: {
    margin: '0 10px',
  },
  select: {
    '&>div': {
      '& span,& img': {
        verticalAlign: 'middle',
      },
    },
  },
}))

export default function PoolSelector() {
  const classes = useStyles()
  const {
    state: { LiteContext, registry },
    setState,
  } = useContext(Context)
  const {
    liteState: { lite, poolList, bond, want, bondList, wantList },
    setLiteState,
  } = useContext(LiteContext)

  useEffect(() => {
    const bondList = new Set()
    const poolList = []
    Object.keys(registry.pool).map((id, key) => {
      const pool = registry.pool[id]
      bondList.add(pool.addr_bond)
      poolList.push({ id, bondToken: pool.addr_bond, wantToken: pool.addr_want })
    })
    setLiteState({ bondList: Array.from(bondList), poolList, bond: lite.pool().addr_bond })
  }, [])

  useEffect(() => {
    const wantList = poolList.filter((val) => val.bondToken == bond).map((val) => val.wantToken)
    setLiteState({ wantList, want: wantList[0] || 0 })
  }, [bond])

  useEffect(() => {
    const pool = poolList.filter((val) => val.bondToken == bond && val.wantToken == want)[0]
    pool && lite.reset(null, () => pool.id)
    setLiteState({ forceUpdate: true })
  }, [want])

  return (
    <div className={classes.root}>
      <span className={classes.formControlTitle}>Selector Pair</span>
      <div className={classes.formControlList}>
        <FormControl className={classes.formControl}>
          <Select
            value={bond}
            onChange={(e) => {
              setLiteState({ bond: e.target.value })
            }}
            className={classes.select}
            IconComponent={ExpandMoreIcon}
          >
            {bondList.length ? (
              bondList.map((val, key) => (
                <MenuItem value={val} key={key}>
                  <img alt="" src={iconUsdt} className={classes.icon} />
                  <span style={{ fontFamily: 'Gillsans' }}>{registry.token[val].symbol}</span>
                </MenuItem>
              ))
            ) : (
              <MenuItem value={0}></MenuItem>
            )}
          </Select>
        </FormControl>

        <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />

        <FormControl className={classes.formControl}>
          <Select
            value={want}
            onChange={(e) => setLiteState({ want: e.target.value })}
            className={classes.select}
            IconComponent={ExpandMoreIcon}
          >
            {wantList.length ? (
              wantList.map((val, key) => (
                <MenuItem value={val} key={key}>
                  <img alt="" src={iconUsdc} className={classes.icon} />
                  <span style={{ fontFamily: 'Gillsans' }}>{registry.token[val].symbol}</span>
                </MenuItem>
              ))
            ) : (
              <MenuItem value={0}></MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    </div>
  )
}
